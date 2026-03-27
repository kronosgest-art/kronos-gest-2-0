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

    let body
    try {
      body = await req.json()
    } catch (e) {
      throw {
        status: 400,
        message: 'O corpo da requisição não é um JSON válido',
        details: 'Leitura do payload da requisição',
      }
    }

    const { pdfBase64 } = body

    if (!pdfBase64) {
      throw {
        status: 400,
        message: 'Os dados do PDF (pdfBase64) não foram fornecidos ou estão vazios.',
        details: 'Extração dos dados do PDF da requisição',
      }
    }

    console.log(`[interpret-bioresonance] Received PDF with length: ${pdfBase64.length}`)

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

    if (!GEMINI_API_KEY) {
      throw {
        status: 500,
        message: 'A chave da API do Gemini (GEMINI_API_KEY) não está configurada.',
        details: 'Validação de variáveis de ambiente do servidor',
      }
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
          throw {
            status: 408,
            message: `A requisição para o Gemini (modelo ${model}) excedeu o tempo limite de 30 segundos.`,
            details: 'Chamada à API Gemini (Timeout)',
          }
        }
        throw {
          status: 502,
          message: `Erro de rede ao conectar com o modelo ${model}: ${err.message}`,
          details: 'Chamada à API Gemini (Erro de conexão)',
        }
      }
    }

    let response: Response
    try {
      response = await generateContent('gemini-2.0-flash')
    } catch (err: any) {
      if (err.status) throw err
      throw {
        status: 500,
        message: err.message,
        details: 'Tentativa de chamada ao modelo principal (gemini-2.0-flash)',
      }
    }

    if (!response.ok) {
      const errText = await response.text()
      console.warn(
        `[interpret-bioresonance] gemini-2.0-flash failed with status ${response.status}: ${errText}`,
      )
      console.log('[interpret-bioresonance] Falling back to model: gemini-1.5-pro')

      try {
        response = await generateContent('gemini-1.5-pro')
      } catch (err2: any) {
        if (err2.status) throw err2
        throw {
          status: 500,
          message: err2.message,
          details: 'Tentativa de fallback para modelo alternativo (gemini-1.5-pro)',
        }
      }

      if (!response.ok) {
        const fallbackErrText = await response.text()
        console.error(
          `[interpret-bioresonance] Fallback gemini-1.5-pro also failed with status ${response.status}: ${fallbackErrText}`,
        )
        throw {
          status: response.status,
          message: fallbackErrText,
          details: 'Chamada à API Gemini (Modelos principal e fallback falharam)',
        }
      }
    }

    let data
    try {
      data = await response.json()
    } catch (e) {
      throw {
        status: 500,
        message: 'A resposta da API do Gemini não é um JSON válido.',
        details: 'Parsing da resposta da API',
      }
    }

    console.log(
      `[interpret-bioresonance] Success response from Gemini. Candidates count: ${data.candidates?.length}`,
    )

    const aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!aiResponseText) {
      console.error(
        '[interpret-bioresonance] No text returned from Gemini API.',
        JSON.stringify(data),
      )
      throw {
        status: 422,
        message:
          'A IA não retornou nenhum conteúdo de texto. Verifique se o documento PDF é legível.',
        details: 'Extração do texto da resposta gerada pela IA',
      }
    }

    console.log('[interpret-bioresonance] Finished processing successfully.')
    return new Response(JSON.stringify({ interpretacao: aiResponseText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('[interpret-bioresonance] Capturado erro formatado:', error)

    const errorResponse = {
      error: true,
      status: error.status || 500,
      message: error.message || String(error),
      details: error.details || 'Contexto da falha não identificado ou erro interno do servidor',
    }

    const httpStatus =
      typeof errorResponse.status === 'number' &&
      errorResponse.status >= 400 &&
      errorResponse.status <= 599
        ? errorResponse.status
        : 400

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: httpStatus,
    })
  }
})
