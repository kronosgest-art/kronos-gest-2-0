import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const text = body.text

    if (!text) throw new Error('Texto da biorressonância não fornecido')

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) throw new Error('GEMINI_API_KEY não configurada no servidor')

    const prompt = `Atue como um especialista em saúde integrativa. Analise os dados extraídos de um exame de biorressonância abaixo e forneça uma interpretação clínica clara. Identifique os principais desequilíbrios bioenergéticos, carências nutricionais e sugira protocolos de intervenção naturais.\n\nDados do Exame:\n${text}`

    // Usando gemini-1.5-flash com timeout controller
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
            generationConfig: { temperature: 0.2 },
          }),
          signal: controller.signal,
        },
      )
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        throw new Error(
          'A análise da IA demorou muito tempo. Por favor, tente novamente em instantes.',
        )
      }
      throw fetchError
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API Error:', errorData)
      throw new Error(
        `Serviço da IA indisponível no momento (Status ${response.status}). Tente novamente.`,
      )
    }

    const data = await response.json()
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Interpretação não gerada.'

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Edge Function Error:', error)
    return new Response(JSON.stringify({ error: true, message: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})
