'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Eye } from 'lucide-react'
import { upsertBlogPost } from '@/lib/supabase/actions'
import {
  SectionCard, FormField, DashInput, DashTextarea,
  DashSelect, PageHeader, ImageUploadField, SaveButton,
} from '@/components/dashboard/DashUI'

export default function BlogEditorPage({ post }: { post?: any }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title:    post?.title    ?? '',
    category: post?.category ?? 'How-To Guides',
    author:   post?.author   ?? '',
    excerpt:  post?.excerpt  ?? '',
    content:  post?.content  ?? '',
    image:    post?.image    ?? '',
    status:   post?.status   ?? 'published',
  })

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    if (!form.title || !form.content) { setError('Title and content are required.'); return }
    setError('')
    startTransition(async () => {
      const result = await upsertBlogPost({ ...form, id: post?.id })
      if (result.success) {
        setSaved(true)
        setTimeout(() => { setSaved(false); router.push('/dashboard/blog') }, 1200)
      } else {
        setError(result.error ?? 'Save failed.')
      }
    })
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/blog" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <PageHeader title={post ? 'Edit Blog Post' : 'New Blog Post'} desc={post ? `Editing: ${post.title}` : 'Create a new article'} />
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-5">
          <SectionCard title="Content">
            <div className="p-5 space-y-5">
              <FormField label="Title" required>
                <DashInput value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Enter an engaging title..." />
              </FormField>
              <FormField label="Excerpt" required hint="Short summary shown in the blog listing">
                <DashTextarea value={form.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={3} placeholder="Brief overview..." />
              </FormField>
              <FormField label="Body Content" required>
                <DashTextarea value={form.content} onChange={(e) => set('content', e.target.value)} rows={14} placeholder="Write the full article here..." className="font-mono text-xs leading-relaxed" />
              </FormField>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Publish">
            <div className="p-5 space-y-4">
              <FormField label="Status">
                <DashSelect value={form.status} onChange={(e) => set('status', e.target.value)}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </DashSelect>
              </FormField>
              <SaveButton saved={saved} onClick={handleSave} label={isPending ? 'Saving...' : 'Save Post'} />
              {post && (
                <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                  <Eye className="w-4 h-4" /> Preview on Site
                </Link>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Post Details">
            <div className="p-5 space-y-4">
              <FormField label="Category">
                <DashSelect value={form.category} onChange={(e) => set('category', e.target.value)}>
                  <option>How-To Guides</option>
                  <option>Green Cleaning</option>
                  <option>Commercial Cleaning</option>
                  <option>Residential Tips</option>
                  <option>Industry News</option>
                </DashSelect>
              </FormField>
              <FormField label="Author Name">
                <DashInput value={form.author} onChange={(e) => set('author', e.target.value)} placeholder="e.g. Sarah Mitchell" />
              </FormField>
            </div>
          </SectionCard>

          <SectionCard title="Featured Image">
            <div className="p-5">
              <ImageUploadField value={form.image} onChange={(v) => set('image', v)} />
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
