import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    if (!token) return NextResponse.json({ success: false, error: 'Missing token' }, { status: 400 })

    const supabase = createServiceClient()
    const { data: invite, error } = await supabase.from('invitations').select('email, name, role, used, expires_at').eq('token', token).limit(1).maybeSingle()
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    if (!invite) return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 })
    if (invite.used) return NextResponse.json({ success: false, error: 'Invitation already used' }, { status: 400 })
    if (new Date(invite.expires_at) < new Date()) return NextResponse.json({ success: false, error: 'Invitation expired' }, { status: 400 })

    return NextResponse.json({ success: true, email: invite.email, name: invite.name ?? null, role: invite.role })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
