import { NextRequest, NextResponse } from 'next/server'
import { bookAppointment } from '@/lib/supabase/actions'

export async function POST(req: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ Missing Supabase env vars:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      })
      return NextResponse.json(
        { success: false, error: 'Server configuration error: missing Supabase credentials' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const result = await bookAppointment(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('❌ Booking error:', e)
    return NextResponse.json({ success: false, error: e?.message ?? String(e) }, { status: 500 })
  }
}
