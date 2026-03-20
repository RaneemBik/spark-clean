import { NextRequest, NextResponse } from 'next/server'
import { bookAppointment } from '@/lib/supabase/actions'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await bookAppointment(body)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message ?? String(e) }, { status: 500 })
  }
}
