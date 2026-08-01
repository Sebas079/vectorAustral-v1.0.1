import { NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(5).max(2000),
})

export async function POST(request: Request) {
  try {
    // origin check: ensure requests come from allowed hosts when configured
    const allowedRaw = process.env.ALLOWED_ORIGINS || ''
    const allowed = allowedRaw.split(',').map((s) => s.trim()).filter(Boolean)
    const originHeader = request.headers.get('origin') || request.headers.get('referer') || ''
    let origin = ''
    try {
      if (originHeader) origin = new URL(originHeader).origin
    } catch (e) {
      origin = originHeader
    }
    if (allowed.length > 0 && origin && !allowed.includes(origin)) {
      return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
    }

    const data = await request.json()

    const parse = ContactSchema.safeParse(data)
    if (!parse.success) {
      return NextResponse.json({ error: 'Invalid input', details: parse.error.flatten() }, { status: 400 })
    }

    const { name, email, message } = parse.data

    const payload = { name, email, message, receivedAt: new Date().toISOString() }

    // If there's a webhook configured, forward the payload (optional)
    const webhook = process.env.CONTACT_WEBHOOK_URL
    const webhookSecret = process.env.CONTACT_WEBHOOK_SECRET
    if (webhook) {
      try {
        const bodyString = JSON.stringify(payload)
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }

        // If a secret is configured, sign the payload with HMAC-SHA256
        if (webhookSecret) {
          const sig = crypto.createHmac('sha256', webhookSecret).update(bodyString).digest('hex')
          headers['x-vector-signature'] = sig
        }

        await fetch(webhook, {
          method: 'POST',
          headers,
          body: bodyString,
        })
      } catch (err) {
        console.error('Webhook forward failed', err)
      }
    }

    // Log submission for now; ready to be extended to DB or external service.
    console.log('Contact submission:', payload)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
