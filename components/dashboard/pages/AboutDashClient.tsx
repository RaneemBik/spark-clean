'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { updateAboutContent } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, FormField, DashInput, DashTextarea, SaveButton, ImageUploadField, Tabs } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'

export default function AboutDashClient({ initialContent }: { initialContent: any }) {
  const c = initialContent ?? {}
  const [tab, setTab] = useState('Header')
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [header, setHeader]   = useState({ heading: c.heading ?? '', subheading: c.subheading ?? '' })
  const [story, setStory]     = useState({ story_p1: c.story_p1 ?? '', story_p2: c.story_p2 ?? '', story_p3: c.story_p3 ?? '', story_image: c.story_image ?? '' })
  const [values, setValues]   = useState<{icon:string;title:string;desc:string}[]>(c.values ?? [
    { icon:'💚', title:'Care',       desc:'We treat every home and office with the utmost respect, as if it were our own.' },
    { icon:'🎯', title:'Excellence', desc:"We don't cut corners; we clean them. Perfection is our standard." },
    { icon:'🛡️', title:'Trust',      desc:'Reliability and honesty are the cornerstones of our client relationships.' },
    { icon:'🤝', title:'Community',  desc:'We invest in our staff and use eco-friendly products to protect our community.' },
  ])

  const setH = (k: string, v: string) => setHeader((f) => ({ ...f, [k]: v }))
  const setS = (k: string, v: string) => setStory((f) => ({ ...f, [k]: v }))
  const setVal = (i: number, k: string, v: string) =>
    setValues((prev) => prev.map((val, idx) => idx === i ? { ...val, [k]: v } : val))

  const handleSave = () => {
    setError('')
    startTransition(async () => {
      const result = await updateAboutContent({ ...header, ...story, values })
      if (result.success) { setSaved(true); setTimeout(() => setSaved(false), 1500) }
      else setError(result.error ?? 'Save failed.')
    })
  }

  const setH = (k: string, v: string) => setHeader((f) => ({ ...f, [k]: v }))
  const setS = (k: string, v: string) => setStory((f) => ({ ...f, [k]: v }))
  const setVal = (i: number, k: string, v: string) => setValues((prev) => prev.map((val, idx) => idx === i ? { ...val, [k]: v } : val))

  return (
    <PermissionGuard permission="edit_about">
      <div>
        <PageHeader
          title="About Page"
          desc="Edit About Us content"
          action={
            <div className="flex gap-2">
              <Link href="/about" target="_blank" className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                <Eye className="w-4 h-4" /> Preview
              </Link>
              <div className="w-36"><SaveButton saved={saved} onClick={handleSave} label={isPending ? 'Saving...' : 'Save Changes'} /></div>
            </div>
          }
        />
        {error && <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>}
        <Tabs tabs={['Header', 'Our Story', 'Values']} active={tab} onChange={setTab} />

      <div className="mt-5 space-y-5">
        {tab === 'Header' && (
          <SectionCard title="Page Header">
            <div className="p-5 space-y-5">
              <FormField label="Main Heading"><DashInput value={header.heading} onChange={(e) => setH('heading', e.target.value)} /></FormField>
              <FormField label="Subheading"><DashTextarea value={header.subheading} onChange={(e) => setH('subheading', e.target.value)} rows={3} /></FormField>
            </div>
          </SectionCard>
        )}
        {tab === 'Our Story' && (
          <SectionCard title="Our Story Section">
            <div className="p-5 space-y-5">
              <FormField label="Paragraph 1"><DashTextarea value={story.story_p1} onChange={(e) => setS('story_p1', e.target.value)} rows={4} /></FormField>
              <FormField label="Paragraph 2"><DashTextarea value={story.story_p2} onChange={(e) => setS('story_p2', e.target.value)} rows={4} /></FormField>
              <FormField label="Paragraph 3"><DashTextarea value={story.story_p3} onChange={(e) => setS('story_p3', e.target.value)} rows={4} /></FormField>
              <FormField label="Section Image"><ImageUploadField value={story.story_image} onChange={(v) => setS('story_image', v)} /></FormField>
            </div>
          </SectionCard>
        )}
        {tab === 'Values' && (
          <SectionCard title="Company Values">
            <div className="p-5 space-y-4">
              {values.map((val, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="text-xl">{val.icon}</span> Value {i + 1}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField label="Title"><DashInput value={val.title} onChange={(e) => setVal(i, 'title', e.target.value)} /></FormField>
                    <FormField label="Description"><DashInput value={val.desc} onChange={(e) => setVal(i, 'desc', e.target.value)} /></FormField>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        )}
      </div>
    </div>
    </PermissionGuard>
  )
}
