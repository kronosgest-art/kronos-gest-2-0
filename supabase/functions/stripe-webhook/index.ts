import Stripe from 'npm:stripe@^13.0.0'
import { createClient } from 'npm:@supabase/supabase-js@2.39.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') as string

const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string

const supabase = createClient(supabaseUrl, supabaseServiceKey)

Deno.serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature provided', { status: 400 })
  }

  try {
    const body = await req.text()
    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerEmail = session.customer_details?.email || session.customer_email
        const customerId = session.customer as string

        if (customerEmail) {
          const { error } = await supabase
            .from('usuarios')
            .update({
              status: 'ativo',
              stripe_customer_id: customerId,
              updated_at: new Date().toISOString(),
            })
            .eq('email', customerEmail)

          if (error) console.error('Error updating user on checkout complete:', error)
        }
        break
      }
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        if (customerId) {
          const { error } = await supabase
            .from('usuarios')
            .update({ status: 'ativo', updated_at: new Date().toISOString() })
            .eq('stripe_customer_id', customerId)

          if (error) console.error('Error updating user on payment succeeded:', error)
        }
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        if (customerId) {
          const { error } = await supabase
            .from('usuarios')
            .update({ status: 'inativo', updated_at: new Date().toISOString() })
            .eq('stripe_customer_id', customerId)

          if (error) console.error('Error updating user on payment failed:', error)
        }
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        if (customerId) {
          const { error } = await supabase
            .from('usuarios')
            .update({ status: 'inativo', updated_at: new Date().toISOString() })
            .eq('stripe_customer_id', customerId)

          if (error) console.error('Error updating user on sub deleted:', error)
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    console.error('Webhook processing failed:', error)
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 })
  }
})
