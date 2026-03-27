import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { patientData, examesBioquimicos, examesBiofisicos, prescricoes, tipoProtocolo } =
      await req.json()

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set')
    }

    const prompt = `
      Você é um especialista em saúde integrativa. 
      Gere um protocolo de limpeza do tipo "${tipoProtocolo}" para o paciente abaixo.
      
      Dados do paciente: ${JSON.stringify(patientData)}
      Exames Bioquímicos recentes (amostra): ${JSON.stringify(examesBioquimicos?.slice(0, 2))}
      Exames Biofísicos recentes (amostra): ${JSON.stringify(examesBiofisicos?.slice(0, 2))}
      Prescrições recentes (amostra): ${JSON.stringify(prescricoes?.slice(0, 2))}

      Baseado nesses dados, crie as etapas do protocolo e orientações clínicas.
      Retorne ESTRITAMENTE um objeto JSON válido com a seguinte estrutura:
      {
        "etapas": ["etapa 1 com dosagem", "etapa 2 com dosagem", "etapa 3..."],
        "orientacoes": "Texto com orientações clínicas detalhadas e práticas para o paciente."
      }
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            response_mime_type: 'application/json',
          },
        }),
      },
    )

    const data = await response.json()
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!textResponse) {
      throw new Error('Falha ao gerar resposta com a IA.')
    }

    const jsonResponse = JSON.parse(textResponse)

    return new Response(JSON.stringify(jsonResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
