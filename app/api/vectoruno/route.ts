import { NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'

const VectorUnoSchema = z.object({
  userId: z.string().optional(),
  message: z.string().min(1).max(2000),
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
    const parsed = VectorUnoSchema.safeParse(data)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const payload = { ...parsed.data, receivedAt: new Date().toISOString() }

    const webhook = process.env.VECTORUNO_WEBHOOK_URL
    const webhookSecret = process.env.VECTORUNO_WEBHOOK_SECRET
    if (webhook) {
      try {
        const bodyString = JSON.stringify(payload)
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (webhookSecret) {
          const sig = crypto.createHmac('sha256', webhookSecret).update(bodyString).digest('hex')
          headers['x-vector-signature'] = sig
        }
        await fetch(webhook, { method: 'POST', headers, body: bodyString })
      } catch (err) {
        console.error('VectorUno webhook forward failed', err)
      }
    }

    console.log('VectorUno received:', payload)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
