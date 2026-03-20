import { NextRequest, NextResponse } from 'next/server'
import { confirmUserEmail } from '@/lib/supabase/actions'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
    const result = await confirmUserEmail(id)
    if (!result.success) return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message ?? String(e) }, { status: 500 })
  }
}
