import { NextRequest, NextResponse } from 'next/server'
import { updateAppointmentStatus } from '@/lib/supabase/actions'

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''
    let id: string | null = null
    let status: string | null = null

    if (contentType.includes('application/json')) {
      const body = await req.json()
      id = body.id
      status = body.status
    } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const form = await req.formData()
      id = String(form.get('id') || '')
      status = String(form.get('status') || '')
    } else {
      // Try to parse JSON, fallback to formData
      try {
        const body = await req.json()
        id = body.id
        status = body.status
      } catch {
        const form = await req.formData()
        id = String(form.get('id') || '')
        status = String(form.get('status') || '')
      }
    }

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 })
    }

    const result = await updateAppointmentStatus(id, status)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 })
    }

    // If form submission from browser, redirect back to appointments list
    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      return NextResponse.redirect(new URL('/dashboard/appointments', req.url))
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message ?? String(e) }, { status: 500 })
  }
}
