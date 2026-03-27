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
    console.log('[interpret-laboratorial] Request received')
    const { examData } = await req.json()

    if (!examData) {
      console.error('[interpret-laboratorial] examData is missing from request body')
      throw new Error('Os dados do exame (examData) não foram fornecidos.')
    }

    console.log('[interpret-laboratorial] Exam data parsed successfully')

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY) {
      console.error('[interpret-laboratorial] GEMINI_API_KEY is not configured')
      throw new Error('A chave da API do Gemini (GEMINI_API_KEY) não está configurada no servidor.')
    }

    const prompt = `Analise os seguintes dados de exame laboratorial e sugira interpretações clínicas baseadas em medicina integrativa: ${JSON.stringify(examData)}`

    const generateContent = async (model: string) => {
      console.log(`[interpret-laboratorial] Calling Gemini API with model: ${model}`)
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
      console.error('[interpret-laboratorial] Error calling gemini-2.0-flash:', err.message)
      throw new Error(`Erro de rede ao conectar com gemini-2.0-flash: ${err.message}`)
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.warn(
        `[interpret-laboratorial] Model gemini-2.0-flash failed with status ${response.status}: ${errorText}`,
      )
      console.log('[interpret-laboratorial] Falling back to model: gemini-1.5-pro')

      try {
        response = await generateContent('gemini-1.5-pro')
      } catch (err2: any) {
        console.error(
          '[interpret-laboratorial] Error calling fallback gemini-1.5-pro:',
          err2.message,
        )
        throw new Error(`Erro de rede no fallback gemini-1.5-pro: ${err2.message}`)
      }
    }

    if (!response.ok) {
      const errText = await response.text()
      console.error(
        `[interpret-laboratorial] Fallback model gemini-1.5-pro also failed with status ${response.status}: ${errText}`,
      )
      throw new Error(`Falha da API do Gemini: ${errText}`)
    }

    const data = await response.json()
    console.log(
      `[interpret-laboratorial] Success response from Gemini. Candidates count: ${data.candidates?.length}`,
    )

    const interpretacao = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!interpretacao) {
      console.error(
        '[interpret-laboratorial] The IA response did not contain the expected text structure.',
        JSON.stringify(data),
      )
      throw new Error(
        'A IA retornou um formato inesperado e não foi possível extrair a interpretação. Resposta bruta: ' +
          JSON.stringify(data),
      )
    }

    console.log('[interpret-laboratorial] Finished processing successfully.')
    return new Response(JSON.stringify({ interpretacao }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('[interpret-laboratorial] Final catch block error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
