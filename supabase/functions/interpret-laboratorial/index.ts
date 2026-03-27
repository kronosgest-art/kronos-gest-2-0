import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    console.log('[interpret-laboratorial] Request received')

    let body;
    try {
      body = await req.json()
    } catch (e) {
      throw { status: 400, message: "O corpo da requisição não é um JSON válido", details: "Leitura do payload da requisição" }
    }
    
    const { examData, pdfBase64 } = body

    if (pdfBase64) {
      throw { status: 400, message: "O sistema aceita apenas texto estruturado. O envio de pdfBase64 não é suportado.", details: "Validação de payload" }
    }
    
    if (!examData || String(examData).trim() === '') {
      throw { status: 400, message: "Os dados do exame (examData) não foram fornecidos ou estão vazios.", details: "Extração dos dados do exame" }
    }

    const extractedText = typeof examData === 'string' ? examData : JSON.stringify(examData)

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
      throw { status: 500, message: "A chave da API do Gemini (GEMINI_API_KEY) não está configurada no servidor.", details: "Validação de ambiente" }
    }

    const prompt = `Você é um assistente especialista em análises clínicas e medicina integrativa.
Sua tarefa é analisar os dados extraídos do exame laboratorial abaixo.
Interprete os resultados e incorpore sugestões de receita (nutracêuticos/suplementos) seguindo rigorosamente os padrões e valores de referência da SBPC/ML (Sociedade Brasileira de Patologia Clínica/Medicina Laboratorial) e da SPC (Sociedade de Patologia Clínica).

Dados extraídos do Exame:
${extractedText}

Retorne APENAS um objeto JSON válido com a seguinte estrutura exata, sem blocos de código ou markdown em volta:
{
  "tabela_comparacao": [
    {
      "exame": "Nome do Exame",
      "valor_paciente": "Valor encontrado no paciente",
      "valor_referencia": "Valor de referência",
      "status": "Status (ex: Normal, Alterado, Alto, Baixo)"
    }
  ],
  "interpretacao_integrativa": "Texto contendo a interpretação clínica baseada em medicina integrativa em um único parágrafo.",
  "recomendacoes_terapeuticas": [
    "Recomendação 1",
    "Recomendação 2"
  ],
  "sugestao_receita": [
    {
      "item": "Nome do suplemento/ativo",
      "dosagem_posologia": "Dosagem recomendada e posologia",
      "justificativa": "Justificativa clínica baseada nos exames e diretrizes"
    }
  ]
}`

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const generateContent = async (model: string, retries = 2) => {
      let attempt = 0;
      while (attempt <= retries) {
        console.log(`[interpret-laboratorial] Calling Gemini API with model: ${model} (attempt ${attempt + 1})`)
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 120000)
        
        try {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
              }),
              signal: controller.signal,
            }
          )
          clearTimeout(timeoutId)
          
          if (res.status === 429 && attempt < retries) {
            console.warn(`[interpret-laboratorial] Rate limit (429) hit on model ${model}. Retrying in 2 seconds...`)
            attempt++;
            await delay(2000);
            continue;
          }
          
          return res
        } catch (err: any) {
          clearTimeout(timeoutId)
          if (err.name === 'AbortError') {
            throw { status: 408, message: `A requisição para o Gemini excedeu o tempo limite de 120 segundos.`, details: "Timeout" }
          }
          throw { status: 502, message: `Erro de rede ao conectar com o modelo: ${err.message}`, details: "Erro de conexão" }
        }
      }
      throw new Error('Unexpected retry loop exit');
    }

    let response: Response;
    try {
      response = await generateContent('gemini-2.5-flash')
    } catch (err: any) {
      if (err.status) throw err;
      throw { status: 500, message: err.message, details: "Tentativa de chamada ao modelo principal" }
    }
    
    if (!response.ok) {
      const errText = await response.text()
      console.warn(`[interpret-laboratorial] gemini-2.5-flash failed with status ${response.status}: ${errText}`)
      console.log('[interpret-laboratorial] Falling back to model: gemini-2.5-pro')

      try {
        response = await generateContent('gemini-2.5-pro')
      } catch (err2: any) {
        if (err2.status) throw err2;
        throw { status: 500, message: err2.message, details: "Tentativa de fallback" }
      }
      
      if (!response.ok) {
        const fallbackErrText = await response.text()
        console.error(`[interpret-laboratorial] Fallback gemini-2.5-pro also failed with status ${response.status}: ${fallbackErrText}`)
        throw { status: response.status, message: fallbackErrText, details: "Modelos principal e fallback falharam" }
      }
    }
    
    console.log('[interpret-laboratorial] Success response from Gemini. Processing response...')

    let data;
    try {
      data = await response.json()
    } catch (e) {
      throw { status: 500, message: "A resposta da API do Gemini não é um JSON válido.", details: "Parsing da resposta da API" }
    }
    
    const interpretacaoText = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!interpretacaoText) {
      console.error('[interpret-laboratorial] No text returned from Gemini API.', JSON.stringify(data))
      throw { status: 422, message: "A IA não retornou nenhum texto estruturado com a interpretação. Verifique os dados do exame.", details: "Extração do texto gerado" }
    }
    
    console.log('[interpret-laboratorial] Parsing AI response JSON...')
    let interpretacaoJson;
    try {
      interpretacaoJson = JSON.parse(interpretacaoText);
    } catch (e) {
      console.error('[interpret-laboratorial] Failed to parse JSON from AI text:', interpretacaoText)
      throw { status: 500, message: "A resposta da IA não pôde ser convertida para JSON.", details: "Parsing do texto retornado pela IA" }
    }
    
    console.log('[interpret-laboratorial] Finished processing successfully.')
    return new Response(JSON.stringify(interpretacaoJson), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
    
  } catch (error: any) {
    console.error('[interpret-laboratorial] Error caught:', error)

    const errorResponse = {
      error: true,
      status: error.status || 500,
      message: error.message || String(error),
      details: error.details || "Erro interno do servidor"
    }

    const httpStatus = (typeof errorResponse.status === 'number' && errorResponse.status >= 400 && errorResponse.status <= 599) 
      ? errorResponse.status 
      : 500;

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: httpStatus,
    })
  }
})
