import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const text = body.text

    if (!text) throw new Error('Texto do exame não fornecido')

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) throw new Error('GEMINI_API_KEY não configurada no servidor')

    const prompt = `Atue como um especialista em saúde integrativa. Analise os seguintes resultados de exames e forneça uma interpretação clínica focada na visão funcional e integrativa, destacando marcadores fora do ideal e sugerindo condutas e suplementação:\n\n${text}`

    // Adicionando controller de timeout (45 segundos) para estabilidade
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 45000)

    let response
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2, topK: 40, topP: 0.95 },
          }),
          signal: controller.signal,
        },
      )
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        throw new Error('A análise da IA excedeu o tempo limite. Por favor, tente novamente.')
      }
      throw fetchError
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Erro na API do Gemini:', errorText)
      throw new Error(
        `Serviço de IA temporariamente indisponível (Status ${response.status}). Tente novamente.`,
      )
    }

    const data = await response.json()
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Nenhuma análise gerada.'

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Edge Function Error:', error)
    // Retorna HTTP 200 com payload de erro para o frontend lidar amigavelmente, sem causar o erro "non-2xx" cego
    return new Response(JSON.stringify({ error: true, message: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
