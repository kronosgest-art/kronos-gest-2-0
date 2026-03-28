import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

export const corsHeaders = {
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
    const body = await req.json()
    const context = body.context

    if (!context) throw new Error('Contexto clínico não fornecido')

    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) throw new Error('GEMINI_API_KEY não configurada')

    const prompt = `Você é um médico ou terapeuta integrativo altamente experiente. Baseado no seguinte contexto clínico e/ou queixas do paciente, crie uma sugestão de prescrição e conduta terapêutica completa, estruturada e profissional. Inclua, se apropriado, nutracêuticos, fitoterápicos, modificações de estilo de vida e dieta.\n\nContexto do Paciente:\n${context}`

    // Usando gemini-1.5-flash com controller de timeout (45 segundos)
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
            generationConfig: { temperature: 0.3 },
          }),
          signal: controller.signal,
        },
      )
    } catch (fetchError: any) {
      if (fetchError.name === 'AbortError') {
        throw new Error('A geração da sugestão excedeu o tempo limite. Por favor, tente novamente.')
      }
      throw fetchError
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API Error:', errorText)
      throw new Error(
        `Serviço de IA temporariamente indisponível (Status ${response.status}). Tente novamente.`,
      )
    }

    const data = await response.json()
    const result = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Prescrição não gerada.'

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
