'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePermission } from '@/lib/auth/permissions'

// ─── helpers ──────────────────────────────────────────────────────────────────
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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

    const end = data.appointment_end ? new Date(data.appointment_end) : new Date(start.getTime() + 60 * 60 * 1000)
    if (isNaN(end.getTime()) || end <= start) return { success: false, error: 'Invalid end time' }

    // Working hours (08:00 - 18:00) check
    const startHour = start.getUTCHours()
    const endHour = end.getUTCHours()
    if (startHour < 8 || endHour > 18) return { success: false, error: 'Requested time outside working hours' }

    const supabase = createClient()

    // Check availability by fetching existing appointments for the service and checking overlaps in JS
    const { data: existing, error: fetchErr } = await supabase
      .from('appointments')
      .select('appointment_start, appointment_end')
      .eq('service_id', data.service_id)

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
    await requirePermission('manage_users')
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
  if (!key || !from) {
    throw new Error('Email provider not configured (SENDGRID_API_KEY / SENDGRID_FROM)')
  }

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

export async function updateUserRole(userId: string, role: string) {
  try {
    await requirePermission('manage_users')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createServiceClient()
  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
  if (error) return { success: false, error: error.message }
  return { success: true }
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
    // ensure users table mirror
    await supabase.from('users').upsert({ id: userId, email: data?.email ?? null, name: data?.user_metadata?.name ?? null, role: data?.user_metadata?.role ?? 'content_manager' })
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

    // Fallback: send invite email (user will set password via invite link)
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { name, role },
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify`,
    })
    if (error) return { success: false, error: error.message }
    if (data?.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, name, role })
    }
    return { success: true }
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
