import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { pdfBase64 } = await req.json()
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    const systemPrompt = `
      Você é um assistente especialista em analisar relatórios de biorressonância (exames biofísicos).
      Analise o documento PDF em anexo e identifique:
      1. Frequências e desequilíbrios energéticos principais.
      2. Sugestões de protocolos clínicos integrativos para:
         - Termobiologia (banhos, saunas, contrastes, etc.)
         - Desparasitação (nutracêuticos, frequência, dieta restritiva, etc.)
         - Detoxificação metabólica/hepática (fitoterápicos, alimentação, etc.)
      
      Formate a resposta de maneira estruturada, com títulos e bullet points, em português claro e profissional.
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt },
                {
                  inlineData: {
                    mimeType: 'application/pdf',
                    data: pdfBase64,
                  },
                },
              ],
            },
          ],
        }),
      },
    )

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Failed to generate content from Gemini API: ${err}`)
    }

    const data = await response.json()
    const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Não foi possível gerar a interpretação. Verifique o documento enviado."

    return new Response(JSON.stringify({ interpretacao: aiResponseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
