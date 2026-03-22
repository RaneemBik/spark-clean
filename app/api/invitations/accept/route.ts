import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()
    if (!token || !password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ success: false, error: 'Invalid token or password (min 8 chars)' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Find the invitation
    const { data: invites, error: invErr } = await supabase.from('invitations').select('*').eq('token', token).limit(1).maybeSingle()
    if (invErr) return NextResponse.json({ success: false, error: invErr.message }, { status: 500 })
    const invite = invites as any
    if (!invite) return NextResponse.json({ success: false, error: 'Invitation not found' }, { status: 404 })
    if (invite.used) return NextResponse.json({ success: false, error: 'Invitation already used' }, { status: 400 })
    if (new Date(invite.expires_at) < new Date()) return NextResponse.json({ success: false, error: 'Invitation expired' }, { status: 400 })

    // Create the user with admin API so password is securely stored by Supabase
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email: invite.email,
      password,
      user_metadata: { name: invite.name ?? null, role: invite.role ?? 'content_manager' },
      email_confirm: true,
    })

    // If creation failed because a user already exists, attempt to find and update that user
    if (createErr) {
      try {
        const { data: listData, error: listErr } = await supabase.auth.admin.listUsers()
        if (listErr) return NextResponse.json({ success: false, error: createErr.message }, { status: 500 })
        const existing = listData?.users?.find((u: any) => (u.email || '').toLowerCase() === (invite.email || '').toLowerCase())
        if (existing) {
          // update their password + metadata
          const { data: updated, error: updErr } = await supabase.auth.admin.updateUserById(existing.id, {
            password,
            user_metadata: { name: invite.name ?? null, role: invite.role ?? 'content_manager' },
            email_confirm: true,
          })
          if (updErr) return NextResponse.json({ success: false, error: updErr.message }, { status: 500 })

          const userId = existing.id
          await supabase.from('profiles').upsert({ id: userId, name: invite.name ?? null, role: invite.role ?? 'content_manager' })
          await supabase.from('users').upsert({ id: userId, email: invite.email, name: invite.name ?? null, role: invite.role ?? 'content_manager' })

          // mark invite used
          await supabase.from('invitations').update({ used: true, used_at: new Date().toISOString() }).eq('token', token)

          return NextResponse.json({ success: true })
        }
      } catch (e: any) {
        return NextResponse.json({ success: false, error: createErr.message }, { status: 500 })
      }

      return NextResponse.json({ success: false, error: createErr.message }, { status: 500 })
    }

    const userId = created?.user?.id
    if (userId) {
      // upsert mirrors
      await supabase.from('profiles').upsert({ id: userId, name: invite.name ?? null, role: invite.role ?? 'content_manager' })
      await supabase.from('users').upsert({ id: userId, email: invite.email, name: invite.name ?? null, role: invite.role ?? 'content_manager' })
    }

    // mark invite used
    await supabase.from('invitations').update({ used: true, used_at: new Date().toISOString() }).eq('token', token)

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
