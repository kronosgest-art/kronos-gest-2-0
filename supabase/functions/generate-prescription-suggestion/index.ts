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
    const body = await req.json()
    const { clienteId, patientData, anamnese, exameBioquimico, exameBiofisico } = body
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

    if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not configured')

    const cliente = patientData || {}
    const anamneseData = anamnese || {}
    const exameBioq = exameBioquimico || {}
    const exame = exameBiofisico || {}

    const systemPrompt = `
      Você é um especialista em medicina integrativa.
      Analise os dados do paciente para sugerir um protocolo clínico de suplementação.
      
      Dados do Paciente:
      - Nome: ${cliente.nome || 'Não informado'}
      - Idade: ${cliente.idade || 'Não informada'}
      - Sexo: ${cliente.sexo || 'Não informado'}
      - Peso: ${cliente.peso || 'Não informado'}
      - Altura: ${cliente.altura || 'Não informada'}
      - IMC: ${cliente.imc || 'Não informado'}

      Anamnese Recente:
      - Queixa principal: ${anamneseData.queixa_principal || 'Não informada'}
      - Histórico de doenças: ${anamneseData.historico_doencas || 'Não informado'}
      - Medicamentos: ${anamneseData.medicamentos_atuais || 'Não informado'}
      - Alergias: ${anamneseData.alergias || 'Não informado'}
      
      Interpretação do Exame Biofísico (IA):
      ${exame.interpretacao_ia || 'Nenhum exame biofísico recente analisado.'}

      Interpretação do Exame Bioquímico (IA):
      ${exameBioq.interpretacao_ia || 'Nenhum exame bioquímico recente analisado.'}

      Baseado nisso, sugira uma prescrição completa.
      
      Retorne APENAS um JSON válido com a seguinte estrutura exata, sem blocos de código ou markdown em volta:
      {
        "observacoes": "Breve justificativa clínica baseada nos dados analisados, explicando o porquê destas escolhas e observações gerais.",
        "itens_prescricao": [
          {
            "supplement": "Nome do suplemento/ativo (ex: Vitamina D3)",
            "dosage": "Dosagem (ex: 10.000 UI)",
            "frequency": "Frequência (ex: 1x ao dia)",
            "duration": "Duração (ex: 60 dias)",
            "justification": "Justificativa específica para este suplemento (opcional)"
          }
        ]
      }
    `

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        }),
      }
    )

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Failed to generate content: ${err}`)
    }

    const data = await response.json()
    const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
    let parsedSuggestion = {}
    
    try {
      parsedSuggestion = JSON.parse(aiResponseText)
    } catch(e) {
      console.error('Error parsing JSON from AI', e)
    }

    return new Response(JSON.stringify({ suggestion: parsedSuggestion }), {
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
