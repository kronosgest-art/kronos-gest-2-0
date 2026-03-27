import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[interpret-bioresonance] Request received')
    const { pdfBase64 } = await req.json()

    if (!pdfBase64) {
      console.error('[interpret-bioresonance] PDF data is missing')
      throw new Error(
        'Os dados do PDF (pdfBase64) não foram fornecidos ou não puderam ser lidos corretamente.',
      )
    }

    console.log(`[interpret-bioresonance] Received PDF with length: ${pdfBase64.length}`)

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

    if (!GEMINI_API_KEY) {
      console.error('[interpret-bioresonance] GEMINI_API_KEY is not configured')
      throw new Error('A chave da API do Gemini (GEMINI_API_KEY) não está configurada no servidor.')
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

    const generateContent = async (model: string) => {
      console.log(`[interpret-bioresonance] Calling Gemini API with model: ${model}`)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout

      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
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
            signal: controller.signal,
          },
        )
        clearTimeout(timeoutId)
        return res
      } catch (err: any) {
        clearTimeout(timeoutId)
        if (err.name === 'AbortError') {
          throw new Error(
            `A requisição para o Gemini (modelo ${model}) excedeu o tempo limite de 30 segundos.`,
          )
        }
        throw err
      }
    }

    let response: Response
    try {
      response = await generateContent('gemini-2.0-flash')
    } catch (err: any) {
      console.error('[interpret-bioresonance] Error calling gemini-2.0-flash:', err.message)
      throw new Error(`Erro de rede ao conectar com gemini-2.0-flash: ${err.message}`)
    }

    if (!response.ok) {
      const err = await response.text()
      console.warn(
        `[interpret-bioresonance] gemini-2.0-flash failed with status ${response.status}: ${err}`,
      )
      console.log('[interpret-bioresonance] Falling back to model: gemini-1.5-pro')

      try {
        response = await generateContent('gemini-1.5-pro')
      } catch (err2: any) {
        console.error(
          '[interpret-bioresonance] Error calling fallback gemini-1.5-pro:',
          err2.message,
        )
        throw new Error(`Erro de rede no fallback gemini-1.5-pro: ${err2.message}`)
      }
    }

    if (!response.ok) {
      const err = await response.text()
      console.error(
        `[interpret-bioresonance] Fallback gemini-1.5-pro also failed with status ${response.status}: ${err}`,
      )
      throw new Error(
        `Falha ao gerar conteúdo da API do Gemini (ambos os modelos falharam). Detalhes: ${err}`,
      )
    }

    const data = await response.json()
    console.log(
      `[interpret-bioresonance] Success response from Gemini. Candidates count: ${data.candidates?.length}`,
    )

    const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponseText) {
      console.error(
        '[interpret-bioresonance] No text returned from Gemini API.',
        JSON.stringify(data),
      )
      throw new Error(
        'A IA não retornou nenhum texto. Verifique se o documento PDF é válido e possui conteúdo legível.',
      )
    }

    console.log('[interpret-bioresonance] Finished processing successfully.')
    return new Response(JSON.stringify({ interpretacao: aiResponseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('[interpret-bioresonance] Final catch block error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
