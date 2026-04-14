import { NextRequest, NextResponse } from 'next/server'
import { getAvailableAppointmentSlots } from '@/lib/supabase/actions'

export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url)
    const serviceId = searchParams.get('service_id')
    const date = searchParams.get('date')
    const offset = searchParams.get('timezone_offset_minutes')

    if (!serviceId || !date || offset === null) {
      return NextResponse.json(
        { success: false, error: 'Missing service_id, date, or timezone_offset_minutes' },
        { status: 400 }
      )
    }

    const result = await getAvailableAppointmentSlots({
      service_id: serviceId,
      date,
      timezone_offset_minutes: Number(offset),
    })

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true, slots: result.slots })
  } catch (e: any) {
    console.error('❌ Availability error:', e)
    return NextResponse.json({ success: false, error: e?.message ?? String(e) }, { status: 500 })
  }
}
