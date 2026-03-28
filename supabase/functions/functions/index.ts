import 'jsr:@supabase/functions-js/edge-runtime.d.ts'

Deno.serve(async () => {
  return new Response(JSON.stringify({ status: 'ok', message: 'Dummy function to fix entrypoint error' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
