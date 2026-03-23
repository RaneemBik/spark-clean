"use server"

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'
let nodemailer: any = null
try { nodemailer = require('nodemailer') } catch (e) { nodemailer = null }
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePermission } from '@/lib/auth/permissions'

// ─── helpers ──────────────────────────────────────────────────────────────────
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const WORKING_HOUR_START = 8
const WORKING_HOUR_END = 18
const SLOT_MINUTES = 60

function parseDateParts(date: string) {
  const [yearStr, monthStr, dayStr] = date.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)

  if (!year || !month || !day) return null
  return { year, month, day }
}

function toUtcMsForLocalDateTime(year: number, month: number, day: number, hour: number, minute: number, tzOffsetMinutes: number) {
  return Date.UTC(year, month - 1, day, hour, minute, 0, 0) + tzOffsetMinutes * 60_000
}

export async function getAvailableAppointmentSlots(params: {
  service_id: string
  date: string // YYYY-MM-DD in visitor local date
  timezone_offset_minutes: number
}) {
  const parts = parseDateParts(params.date)
  if (!parts) return { success: false, error: 'Invalid date format' }

  const { year, month, day } = parts
  const tzOffset = Number(params.timezone_offset_minutes)
  if (Number.isNaN(tzOffset)) return { success: false, error: 'Invalid timezone offset' }

  const dayStartUtcMs = toUtcMsForLocalDateTime(year, month, day, 0, 0, tzOffset)
  const dayEndUtcMs = toUtcMsForLocalDateTime(year, month, day + 1, 0, 0, tzOffset)
  const nowMs = Date.now()

  const supabase = createServiceClient()
  const { data: existing, error } = await supabase
    .from('appointments')
    .select('appointment_start, appointment_end')
    .eq('service_id', params.service_id)
    .eq('status', 'pending')
    .lt('appointment_start', new Date(dayEndUtcMs).toISOString())
    .gt('appointment_end', new Date(dayStartUtcMs).toISOString())

  if (error) return { success: false, error: error.message }

  const slots: Array<{ start_iso: string; end_iso: string; label: string }> = []
  for (let hour = WORKING_HOUR_START; hour < WORKING_HOUR_END; hour += SLOT_MINUTES / 60) {
    const startUtcMs = toUtcMsForLocalDateTime(year, month, day, hour, 0, tzOffset)
    const endUtcMs = startUtcMs + SLOT_MINUTES * 60_000

    if (endUtcMs <= nowMs) continue

    const overlaps = (existing || []).some((appt: { appointment_start: string; appointment_end: string }) => {
      const bookedStart = new Date(appt.appointment_start).getTime()
      const bookedEnd = new Date(appt.appointment_end).getTime()
      return startUtcMs < bookedEnd && endUtcMs > bookedStart
    })

    if (!overlaps) {
      slots.push({
        start_iso: new Date(startUtcMs).toISOString(),
        end_iso: new Date(endUtcMs).toISOString(),
        label: `${String(hour).padStart(2, '0')}:00`,
      })
    }
  }

  return { success: true, slots }
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
export async function submitContactForm(formData: FormData) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('contact_submissions').insert({
    first_name: formData.get('firstName') as string,
    last_name:  formData.get('lastName')  as string,
    email:      formData.get('email')     as string,
    phone:      (formData.get('phone') as string) || '',
    subject:    formData.get('subject')   as string,
    message:    formData.get('message')   as string,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ─── PROJECT INTEREST FORM ────────────────────────────────────────────────────
export async function submitProjectInterest(formData: FormData) {
  const supabase = createServiceClient()
  const { error } = await supabase.from('project_submissions').insert({
    project_id:    formData.get('projectId')    as string,
    project_title: formData.get('projectTitle') as string,
    name:          formData.get('name')         as string,
    email:         formData.get('email')        as string,
    phone:         (formData.get('phone') as string) || '',
    service:       formData.get('service')      as string,
    message:       formData.get('message')      as string,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ─── HOME CONTENT ─────────────────────────────────────────────────────────────
export async function updateHomeContent(data: Record<string, string>) {  try {
    await requirePermission('edit_home')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }  const supabase = createClient()
  const { error } = await supabase
    .from('home_content').update({ ...data, updated_at: new Date().toISOString() }).eq('id', 1)
  if (error) return { success: false, error: error.message }
  revalidatePath('/')
  return { success: true }
}

// ─── ABOUT CONTENT ────────────────────────────────────────────────────────────
export async function updateAboutContent(data: Record<string, unknown>) {  try {
    await requirePermission('edit_about')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }  const supabase = createClient()
  const { error } = await supabase
    .from('about_content').update({ ...data, updated_at: new Date().toISOString() }).eq('id', 1)
  if (error) return { success: false, error: error.message }
  revalidatePath('/about')
  return { success: true }
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
export async function updateService(id: string, data: Record<string, unknown>) {
  try {
    await requirePermission('edit_services')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createClient()
  const { error } = await supabase
    .from('services').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/services')
  return { success: true }
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
export async function upsertProject(data: Record<string, unknown>) {
  try {
    await requirePermission('edit_projects')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createClient()
  const id = data.id as string | undefined
  const isNew = !id

  const payload = { ...data }
  delete payload.id

  if (isNew) {
    payload.slug = slugify(data.title as string)
    payload.published = true
    const { error } = await supabase.from('projects').insert(payload)
    if (error) return { success: false, error: error.message }
  } else {
    payload.updated_at = new Date().toISOString()
    const { error } = await supabase.from('projects').update(payload).eq('id', id)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/projects')
  revalidatePath(`/projects/${payload.slug}`)
  return { success: true }
}

export async function deleteProject(id: string) {
  try {
    await requirePermission('edit_projects')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/projects')
  return { success: true }
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────
export async function upsertBlogPost(data: Record<string, unknown>) {
  try {
    await requirePermission('edit_blog')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createClient()
  const id = data.id as string | undefined
  const isNew = !id

  const payload = { ...data }
  delete payload.id

  if (isNew) {
    payload.slug = slugify(data.title as string)
    payload.published_at = new Date().toISOString()
    const { error } = await supabase.from('blog_posts').insert(payload)
    if (error) return { success: false, error: error.message }
  } else {
    payload.updated_at = new Date().toISOString()
    const { error } = await supabase.from('blog_posts').update(payload).eq('id', id)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/blog')
  revalidatePath(`/blog/${payload.slug}`)
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  try {
    await requirePermission('edit_blog')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/blog')
  return { success: true }
}

// ─── NEWS ─────────────────────────────────────────────────────────────────────
export async function upsertNewsItem(data: Record<string, unknown>) {
  try {
    await requirePermission('edit_news')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createClient()
  const id = data.id as string | undefined
  const isNew = !id

  const payload = { ...data }
  delete payload.id

  if (isNew) {
    payload.slug = slugify(data.title as string)
    payload.published_at = new Date().toISOString()
    const { error } = await supabase.from('news_items').insert(payload)
    if (error) return { success: false, error: error.message }
  } else {
    payload.updated_at = new Date().toISOString()
    const { error } = await supabase.from('news_items').update(payload).eq('id', id)
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/news')
  revalidatePath(`/news/${payload.slug}`)
  return { success: true }
}

export async function deleteNewsItem(id: string) {
  try {
    await requirePermission('edit_news')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createClient()
  const { error } = await supabase.from('news_items').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/news')
  return { success: true }
}

// ─── CONTACT SUBMISSION STATUS ────────────────────────────────────────────────
export async function updateContactStatus(id: string, status: string) {
  const supabase = createClient()
  const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/contact')
  return { success: true }
}

// ─── PROJECT SUBMISSION STATUS ────────────────────────────────────────────────
export async function updateProjectSubmissionStatus(id: string, status: string) {
  const supabase = createClient()
  const { error } = await supabase.from('project_submissions').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/submissions')
  return { success: true }
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export async function signIn(email: string, password: string) {
  const supabase = createClient()
  console.log('🔐 SignIn: Attempting authentication for', email)

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    console.error('❌ SignIn error:', error)
    return { success: false, error: error.message }
  }

  console.log('✅ SignIn: Auth successful')
  const userId = data?.user?.id ?? data?.session?.user?.id
  console.log('🔐 SignIn: User id:', userId)

  // Attempt to read role from mirror `users` table (preferred) or from user metadata
  try {
    let role: string | null = null
    if (userId) {
      const { data: userRow, error: rowErr } = await supabase.from('users').select('role').eq('id', userId).single()
      if (!rowErr && userRow) role = (userRow as any).role
    }
    // fallback to metadata
    if (!role) role = (data?.user?.user_metadata as any)?.role ?? (data?.session?.user?.user_metadata as any)?.role ?? null

    // Verify session is in cookies by checking getUser()
    const { data: getUserData } = await supabase.auth.getUser()
    console.log('🔐 SignIn: Verification - getUser() returns:', getUserData?.user?.email || 'NOT FOUND')

    return { success: true, role: role ?? 'content_manager' }
  } catch (err: any) {
    console.error('❌ SignIn post-check error:', err)
    return { success: true, role: 'content_manager' }
  }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// ─── APPOINTMENTS ──────────────────────────────────────────────────────────
export async function bookAppointment(data: {
  service_id: string
  name: string
  email: string
  phone?: string
  location: string
  appointment_start: string // ISO string
  appointment_end?: string // ISO string, optional (defaults to +1 hour)
}) {
  try {
    // Basic validation
    const start = new Date(data.appointment_start)
    if (isNaN(start.getTime())) return { success: false, error: 'Invalid start time' }

    if (start.getTime() < Date.now()) return { success: false, error: 'Cannot book a past time' }

    const end = data.appointment_end ? new Date(data.appointment_end) : new Date(start.getTime() + 60 * 60 * 1000)
    if (isNaN(end.getTime()) || end <= start) return { success: false, error: 'Invalid end time' }

    const supabase = createClient()

    // Only pending bookings block the same time window.
    const { data: existing, error: fetchErr } = await supabase
      .from('appointments')
      .select('appointment_start, appointment_end')
      .eq('service_id', data.service_id)
      .eq('status', 'pending')

    if (fetchErr) return { success: false, error: fetchErr.message }
    if (existing && existing.length > 0) {
      for (const appt of existing) {
        const s = new Date(appt.appointment_start)
        const e = new Date(appt.appointment_end)
        // overlap if requested start < existing end AND requested end > existing start
        if (start < e && end > s) {
          return { success: false, error: 'No availability for the selected time' }
        }
      }
    }

    const { error } = await supabase.from('appointments').insert({
      service_id: data.service_id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      location: data.location,
      appointment_start: start.toISOString(),
      appointment_end: end.toISOString(),
      status: 'pending',
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (e: any) {
    return { success: false, error: e?.message ?? String(e) }
  }
}

export async function getAllAppointments() {
  try {
    // Only server-side callers should use this (enforced in server code with requirePermission)
    const supabase = createServiceClient()
    const { data } = await supabase.from('appointments').select('*').order('appointment_start', { ascending: false })
    return data || []
  } catch (e) {
    return []
  }
}

export async function updateAppointmentStatus(id: string, status: string) {
  try {
    await requirePermission('reply_messages')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createServiceClient()
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

// ─── REPLY TO CONTACT / APPOINTMENT (communications role) ───────────────────
async function sendEmail(to: string, subject: string, htmlBody: string, textBody?: string) {
  const key = process.env.SENDGRID_API_KEY
  const from = process.env.SENDGRID_FROM
  const allowDevLogOnly = process.env.ALLOW_DEV_EMAIL_LOG === 'true'
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpFrom = process.env.SMTP_FROM

  // If SendGrid configured, use it
  if (key && from) {
    const payload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from },
      subject,
      content: [
        { type: 'text/plain', value: textBody || '' },
        { type: 'text/html', value: htmlBody || '' },
      ],
    }

    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Failed to send email: ${res.status} ${text}`)
    }
    return
  }

  // Otherwise attempt SMTP if configured
  if (smtpHost && smtpPort && smtpUser && smtpPass && smtpFrom) {
    await sendViaSmtp(to, subject, htmlBody, textBody)
    return
  }

  // Optional local-only debug mode: log email if explicitly enabled.
  if (process.env.NODE_ENV === 'development' && allowDevLogOnly) {
    console.warn('DEV: ALLOW_DEV_EMAIL_LOG=true, email not sent to external provider')
    console.group && console.group('DEV EMAIL')
    console.warn('To:', to)
    console.warn('Subject:', subject)
    console.warn('Text body:', textBody)
    console.warn('HTML body:', htmlBody)
    console.groupEnd && console.groupEnd()
    return
  }

  // Fallback: if we reached here, something is misconfigured
  throw new Error('No email provider configured. Set SendGrid (SENDGRID_API_KEY/SENDGRID_FROM) or SMTP (SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS/SMTP_FROM).')
}

// Fallback: send via SMTP if SendGrid not configured
async function sendViaSmtp(to: string, subject: string, htmlBody: string, textBody?: string) {
  if (!nodemailer) throw new Error('nodemailer not installed')
  const smtpHost = process.env.SMTP_HOST!
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10)
  const smtpUser = process.env.SMTP_USER!
  const smtpPass = process.env.SMTP_PASS!
  const from = process.env.SMTP_FROM!

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: { user: smtpUser, pass: smtpPass },
  })

  const info = await transporter.sendMail({ from, to, subject, text: textBody || '', html: htmlBody })
  return info
}

export async function replyToContact(id: string, subject: string, message: string) {
  try {
    await requirePermission('reply_messages')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase.from('contact_submissions').select('email, first_name').eq('id', id).single()
  if (error || !data) return { success: false, error: error?.message ?? 'Contact not found' }

  const to = data.email as string
  const name = (data.first_name as string) || ''
  const html = `<p>Hi ${name},</p><div>${message}</div><p>— Spark Clean</p>`

  try {
    await sendEmail(to, subject, html, message)
  } catch (err: any) {
    return { success: false, error: err?.message ?? String(err) }
  }

  // mark replied
  await supabase.from('contact_submissions').update({ status: 'replied' }).eq('id', id)
  revalidatePath('/dashboard/contact')
  return { success: true }
}

export async function replyToAppointment(id: string, subject: string, message: string) {
  try {
    await requirePermission('reply_messages')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase.from('appointments').select('email, name').eq('id', id).single()
  if (error || !data) return { success: false, error: error?.message ?? 'Appointment not found' }

  const to = data.email as string
  const name = (data.name as string) || ''
  const html = `<p>Hi ${name},</p><div>${message}</div><p>— Spark Clean</p>`

  try {
    await sendEmail(to, subject, html, message)
  } catch (err: any) {
    return { success: false, error: err?.message ?? String(err) }
  }

  revalidatePath('/dashboard/appointments')
  return { success: true }
}

// ─── USER MANAGEMENT (super admin only) ───────────────────────────────────────
export async function inviteUser(email: string, name: string, role: string) {
  try {
    await requirePermission('manage_users')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createServiceClient()
  try {
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { name, role },
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify`,
    })
    if (error) return { success: false, error: error.message }
    // Pre-set their profile role
    if (data?.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, name, role })
    }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? String(err) }
  }
}

// Create an invitation record and send a tokenized invite link
export async function createInvitation(email: string, name: string, role: string, daysValid = 7) {
  try {
    await requirePermission('manage_users')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }

  const supabase = createServiceClient()
  try {
    const token = randomBytes(48).toString('hex')
    const expiresAt = new Date(Date.now() + daysValid * 24 * 60 * 60 * 1000).toISOString()

    const { error } = await supabase.from('invitations').insert({ email, name, role, token, expires_at: expiresAt })
    if (error) return { success: false, error: error.message }

    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const link = `${base}/set-password?token=${token}`
    const subject = 'You have been invited to SparkClean'
    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.4; color:#111">
        <p>Hi ${name || ''},</p>
        <p>You have been invited to join SparkClean as <strong>${role}</strong> for the email <strong>${email}</strong>.</p>
        <p style="margin:20px 0">Click the button below to set your password and activate your account. This link will expire in ${daysValid} days.</p>
        <p style="text-align:center; margin:24px 0">
          <a href="${link}" style="background-color:#10b981;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Set your password</a>
        </p>
        <p style="font-size:12px;color:#666">Or use this link: <a href="${link}">${link}</a></p>
        <p>— SparkClean</p>
      </div>
    `
    const text = `Set your password: ${link}`

    try {
      await sendEmail(email, subject, html, text)
    } catch (mailErr: any) {
      // If email sending fails, remove the just-created invite to avoid orphaned pending records.
      await supabase.from('invitations').delete().eq('token', token)
      throw mailErr
    }
    // Always return success only; do not return the token to the client UI.
    // In dev the email contents (including link) are logged by sendEmail(), visible in server logs.
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? String(err) }
  }
}

export async function updateUserRole(userId: string, role: string) {
  try {
    await requirePermission('manage_users')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createServiceClient()
  try {
    const { error: profErr } = await supabase.from('profiles').update({ role }).eq('id', userId)
    if (profErr) return { success: false, error: profErr.message }

    // Keep the `users` mirror in sync as sign-in prefers that table
    const { error: usersErr } = await supabase.from('users').update({ role }).eq('id', userId)
    if (usersErr) return { success: false, error: usersErr.message }

    // Also update the auth user's metadata so the role is consistent across auth responses
    try {
      const { data, error: updErr } = await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { role },
      })
      if (updErr) {
        // Not fatal for DB mirrors, but surface the error
        return { success: false, error: updErr.message }
      }
    } catch (e: any) {
      return { success: false, error: e?.message ?? String(e) }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? String(err) }
  }
}

export async function confirmUserEmail(userId: string) {
  try {
    await requirePermission('manage_users')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createServiceClient()
  try {
    const { data, error } = await supabase.auth.admin.updateUserById(userId, { email_confirm: true })
    if (error) return { success: false, error: error.message }
    const updatedUser: any = data?.user
    // ensure users table mirror
    await supabase.from('users').upsert({ id: userId, email: updatedUser?.email ?? null, name: updatedUser?.user_metadata?.name ?? null, role: updatedUser?.user_metadata?.role ?? 'content_manager' })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? String(err) }
  }
}

export async function getAllUsers() {
  const supabase = createServiceClient()
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) return []
  const ids = data.users.map((u) => u.id)
  const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids)
  return data.users.map((u) => ({
    ...u,
    profile: profiles?.find((p) => p.id === u.id) ?? null,
  }))
}

export async function createUser(email: string, name: string, role: string, password?: string) {
  try {
    await requirePermission('manage_users')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }

  const supabase = createServiceClient()

  // Use admin create when password provided, otherwise invite flow
  try {
    if (password && password.length >= 8) {
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { name, role },
        email_confirm: true,
      })
      if (error) return { success: false, error: error.message }
      if (data?.user) {
        await supabase.from('profiles').upsert({ id: data.user.id, name, role })
        // Also ensure a users mirror row exists for admin queries
        await supabase.from('users').upsert({ id: data.user.id, email, name, role })
      }
      return { success: true }
    }

    // Fallback: create an invitation token and send our custom invite email
    return await createInvitation(email, name, role)
  } catch (err: any) {
    return { success: false, error: err?.message ?? String(err) }
  }
}

export async function deleteUser(userId: string) {
  try {
    await requirePermission('manage_users')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }

  const supabase = createServiceClient()
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId)
    if (error) return { success: false, error: error.message }
    // cleanup profile & users rows
    await supabase.from('profiles').delete().eq('id', userId)
    await supabase.from('users').delete().eq('id', userId)
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message ?? String(err) }
  }
}
