
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const reference = url.pathname.split('/').pop()

    if (!reference) {
      throw new Error('Payment reference is required')
    }

    const paystackSecretKey = Deno.env.get('PAYSTACK_SECRET_KEY')
    if (!paystackSecretKey) {
      throw new Error('Paystack secret key not configured')
    }

    // Verify payment with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Payment verification failed')
    }

    // If payment is successful, record it in database
    if (data.status && data.data.status === 'success') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      if (supabaseUrl && supabaseServiceKey) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey)
        
        const { metadata } = data.data
        if (metadata.userId && metadata.materialId) {
          // Record the purchase
          await supabase.from('purchases').insert({
            user_id: metadata.userId,
            material_id: metadata.materialId,
            amount: data.data.amount / 100, // Convert from kobo
            transaction_ref: reference,
          })

          // Update user rewards (10% cashback)
          const cashback = Math.floor(data.data.amount / 1000) // 10% in kobo to naira
          await supabase.from('user_rewards').upsert({
            user_id: metadata.userId,
            cash_balance: cashback,
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false,
          })
        }
      }
    }

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ 
        status: 'error', 
        message: error.message || 'Payment verification failed' 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
