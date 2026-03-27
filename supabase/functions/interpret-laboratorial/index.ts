import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    console.log('[interpret-laboratorial] Iniciando processamento da requisição')

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

    const { examData, pdfBase64 } = body

    let extractedText = ''

    if (pdfBase64) {
      console.error('[interpret-laboratorial] pdfBase64 não é mais suportado')
      throw {
        status: 400,
        message: 'O sistema aceita apenas texto estruturado. O envio de pdfBase64 não é suportado.',
        details: 'Validação de payload',
      }
    } else if (examData) {
      console.log('[interpret-laboratorial] Utilizando examData fornecido')
      extractedText = typeof examData === 'string' ? examData : JSON.stringify(examData)
    } else {
      console.error('[interpret-laboratorial] examData is missing from request body')
      throw {
        status: 400,
        message: 'Os dados do exame (examData) não foram fornecidos na requisição.',
        details: 'Extração dos dados do exame',
      }
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      console.error('[interpret-laboratorial] GEMINI_API_KEY is not configured')
      throw {
        status: 500,
        message: 'A chave da API do Gemini (GEMINI_API_KEY) não está configurada no servidor.',
        details: 'Validação de variáveis de ambiente do servidor',
      }
    }

    const prompt = `
      Você é um assistente especialista em análises clínicas e medicina integrativa.
      Sua tarefa é analisar os dados extraídos do exame laboratorial abaixo.
      Interprete os resultados seguindo rigorosamente os padrões e valores de referência da SBPC/ML (Sociedade Brasileira de Patologia Clínica/Medicina Laboratorial) e da SPC (Sociedade de Patologia Clínica).

      Dados extraídos do Exame:
      ${extractedText}

      Retorne uma análise estruturada contendo ESTRITAMENTE as seguintes seções:
      1. Valores dos exames vs. valores de referência (identifique e destaque claramente os desvios encontrados)
      2. Interpretação clínica baseada em medicina integrativa
      3. Recomendações terapêuticas

      Formate a resposta de maneira bem estruturada, com títulos e bullet points, em português claro e profissional.
    `

    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms))

    const generateContent = async (model: string, retries = 2) => {
      let attempt = 0
      while (attempt <= retries) {
        console.log(
          `[interpret-laboratorial] Chamando API Gemini com modelo: ${model} (tentativa ${attempt + 1})`,
        )
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout

        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
              signal: controller.signal,
            },
          )
          clearTimeout(timeoutId)

          if (res.status === 429 && attempt < retries) {
            console.warn(
              `[interpret-laboratorial] Rate limit (429) no modelo ${model}. Aguardando 2 segundos para tentar novamente...`,
            )
            attempt++
            await delay(2000)
            continue
          }

          return res
        } catch (err: any) {
          clearTimeout(timeoutId)
          if (err.name === 'AbortError') {
            console.error(`[interpret-laboratorial] Falha: Timeout no modelo ${model}`)
            throw {
              status: 408,
              message: `A requisição para o Gemini (modelo ${model}) excedeu o tempo limite de 30 segundos.`,
              details: 'Chamada à API Gemini (Timeout)',
            }
          }
          console.error(`[interpret-laboratorial] Falha: Erro de rede no modelo ${model}`, err)
          throw {
            status: 502,
            message: `Erro de rede ao conectar com o modelo ${model}: ${err.message}`,
            details: 'Chamada à API Gemini (Erro de conexão)',
          }
        }
      }
      throw new Error('Unexpected retry loop exit')
    }

    let response: Response
    try {
      console.log('[interpret-laboratorial] Tentativa com gemini-2.5-flash')
      response = await generateContent('gemini-2.5-flash')
    } catch (err: any) {
      if (err.status) throw err
      throw {
        status: 500,
        message: err.message,
        details: 'Tentativa de chamada ao modelo principal (gemini-2.5-flash)',
      }
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.warn(
        `[interpret-laboratorial] Modelo principal falhou. Status ${response.status}: ${errorText}`,
      )
      console.log('[interpret-laboratorial] Iniciando fallback para gemini-2.5-pro')

      try {
        response = await generateContent('gemini-2.5-pro')
      } catch (err2: any) {
        if (err2.status) throw err2
        throw {
          status: 500,
          message: err2.message,
          details: 'Tentativa de fallback para modelo alternativo (gemini-2.5-pro)',
        }
      }

      if (!response.ok) {
        const fallbackErrText = await response.text()
        console.error(
          `[interpret-laboratorial] Modelo de fallback também falhou. Status ${response.status}: ${fallbackErrText}`,
        )
        throw {
          status: response.status,
          message: fallbackErrText,
          details: 'Chamada à API Gemini (Modelos principal e fallback falharam)',
        }
      }
    }

    console.log('[interpret-laboratorial] Resposta da API recebida com sucesso. Iniciando parsing.')
    let data
    try {
      data = await response.json()
    } catch (e) {
      console.error('[interpret-laboratorial] Falha: Resposta da API não é JSON', e)
      throw {
        status: 500,
        message: 'A resposta da API do Gemini não é um JSON válido.',
        details: 'Parsing da resposta da API',
      }
    }

    console.log(`[interpret-laboratorial] Candidates count: ${data.candidates?.length}`)
    const interpretacao = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!interpretacao) {
      console.error(
        '[interpret-laboratorial] Falha: IA não retornou texto esperado. Resposta:',
        JSON.stringify(data),
      )
      throw {
        status: 422,
        message: 'A IA não retornou nenhum texto estruturado com a interpretação.',
        details: 'Extração do texto da resposta gerada pela IA',
      }
    }

    console.log('[interpret-laboratorial] Processamento concluído com sucesso.')
    return new Response(JSON.stringify({ interpretacao }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('[interpret-laboratorial] Capturado erro formatado:', error)

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
