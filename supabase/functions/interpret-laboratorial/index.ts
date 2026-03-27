import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
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
    if (!GEMINI_API_KEY) {
      throw { status: 500, message: "A chave da API do Gemini (GEMINI_API_KEY) não está configurada no servidor.", details: "Validação de ambiente" }
    }

    const prompt = `Você é um assistente especialista em análises clínicas e medicina integrativa.
Sua tarefa é analisar os dados extraídos do exame laboratorial abaixo.
Interprete os resultados seguindo rigorosamente os padrões e valores de referência da SBPC/ML (Sociedade Brasileira de Patologia Clínica/Medicina Laboratorial) e da SPC (Sociedade de Patologia Clínica).

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
  ]
}`

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    const generateContent = async (model: string, retries = 2) => {
      let attempt = 0;
      while (attempt <= retries) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)
        
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
            attempt++;
            await delay(2000);
            continue;
          }
          
          return res
        } catch (err: any) {
          clearTimeout(timeoutId)
          if (err.name === 'AbortError') {
            throw { status: 408, message: `A requisição para o Gemini excedeu o tempo limite.`, details: "Timeout" }
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
      try {
        response = await generateContent('gemini-2.5-pro')
      } catch (err2: any) {
        if (err2.status) throw err2;
        throw { status: 500, message: err2.message, details: "Tentativa de fallback" }
      }
      
      if (!response.ok) {
        const fallbackErrText = await response.text()
        throw { status: 500, message: fallbackErrText, details: "Modelos principal e fallback falharam" }
      }
    }
    
    let data;
    try {
      data = await response.json()
    } catch (e) {
      throw { status: 500, message: "A resposta da API do Gemini não é um JSON válido.", details: "Parsing da resposta da API" }
    }
    
    const interpretacaoText = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!interpretacaoText) {
      throw { status: 500, message: "A IA não retornou nenhum texto estruturado com a interpretação.", details: "Extração do texto gerado" }
    }
    
    let interpretacaoJson;
    try {
      interpretacaoJson = JSON.parse(interpretacaoText);
    } catch (e) {
      throw { status: 500, message: "A resposta da IA não pôde ser convertida para JSON.", details: "Parsing do texto retornado pela IA" }
    }
    
    return new Response(JSON.stringify(interpretacaoJson), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
    
  } catch (error: any) {
    const errorResponse = {
      error: true,
      status: error.status || 500,
      message: error.message || String(error),
      details: error.details || "Erro interno do servidor"
    }

    return new Response(JSON.stringify(errorResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: errorResponse.status,
    })
  }
})
