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
  console.log('🔐 SignIn: User session:', data.session?.user.email)
  console.log('🔐 SignIn: Session created at:', (data.session as any)?.created_at ?? 'unknown')
  
  // Verify session is in cookies by checking immediately
  const { data: { user } } = await supabase.auth.getUser()
  console.log('🔐 SignIn: Verification - getUser() returns:', user?.email || 'NOT FOUND')
  
  return { success: true }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// ─── USER MANAGEMENT (super admin only) ───────────────────────────────────────
export async function inviteUser(email: string, name: string, role: string) {
  try {
    await requirePermission('manage_users')
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
  const supabase = createServiceClient()
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { name, role },
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify`,
  })
  if (error) return { success: false, error: error.message }
  // Pre-set their profile role
  if (data.user) {
    await supabase.from('profiles').upsert({ id: data.user.id, name, role })
  }
  return { success: true }
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
  if (password && password.length >= 8) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
    })
    if (error) return { success: false, error: error.message }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, name, role })
    }
    return { success: true }
  }

  // Fallback: send invite email (user will set password via invite link)
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { name, role },
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify`,
  })
  if (error) return { success: false, error: error.message }
  if (data.user) {
    await supabase.from('profiles').upsert({ id: data.user.id, name, role })
  }
  return { success: true }
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
