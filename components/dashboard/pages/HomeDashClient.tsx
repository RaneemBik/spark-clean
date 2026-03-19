'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { updateHomeContent } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, FormField, DashInput, DashTextarea, SaveButton, ImageUploadField, Tabs } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'

export default function HomeDashClient({ initialContent }: { initialContent: any }) {
  const c = initialContent ?? {}
  const [tab, setTab] = useState('Hero')
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [hero, setHero] = useState({
    badge:        c.badge        ?? '',
    hero_title:   c.hero_title   ?? '',
    hero_gradient: c.hero_gradient ?? '',
    hero_subtitle: c.hero_subtitle ?? '',
    hero_cta:     c.hero_cta     ?? '',
    hero_image:   c.hero_image   ?? '',
  })

  const [why, setWhy] = useState({
    why_title:        c.why_title        ?? '',
    why_subtitle:     c.why_subtitle     ?? '',
    why_image:        c.why_image        ?? '',
    why_point1_title: c.why_point1_title ?? '',
    why_point1_desc:  c.why_point1_desc  ?? '',
    why_point2_title: c.why_point2_title ?? '',
    why_point2_desc:  c.why_point2_desc  ?? '',
    why_point3_title: c.why_point3_title ?? '',
    why_point3_desc:  c.why_point3_desc  ?? '',
  })

  const [seo, setSeo] = useState({
    meta_title: c.meta_title ?? '',
    meta_desc:  c.meta_desc  ?? '',
  })

  const setH = (k: string, v: string) => setHero((f) => ({ ...f, [k]: v }))
  const setW = (k: string, v: string) => setWhy((f) => ({ ...f, [k]: v }))
  const setS = (k: string, v: string) => setSeo((f) => ({ ...f, [k]: v }))

  const handleSave = () => {
    setError('')
    startTransition(async () => {
      const result = await updateHomeContent({ ...hero, ...why, ...seo })
      if (result.success) { setSaved(true); setTimeout(() => setSaved(false), 1500) }
      else setError(result.error ?? 'Save failed.')
    })
  }

  return (
    <PermissionGuard permission="edit_home">
      <div>
        <PageHeader
          title="Home Page"
          desc="Edit the public-facing home page content"
          action={
          <div className="flex gap-2">
            <Link href="/" target="_blank" className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              <Eye className="w-4 h-4" /> Preview
            </Link>
            <div className="w-36"><SaveButton saved={saved} onClick={handleSave} label={isPending ? 'Saving...' : 'Save Changes'} /></div>
          </div>
        }
      />
      {error && <div className="mb-4 bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-100">{error}</div>}
      <Tabs tabs={['Hero', 'Why Us', 'SEO']} active={tab} onChange={setTab} />

      <div className="mt-5 space-y-5">
        {tab === 'Hero' && (
          <>
            <SectionCard title="Hero Section">
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Badge Text"><DashInput value={hero.badge} onChange={(e) => setH('badge', e.target.value)} /></FormField>
                <FormField label="CTA Button Label"><DashInput value={hero.hero_cta} onChange={(e) => setH('hero_cta', e.target.value)} /></FormField>
                <FormField label="Title Line 1"><DashInput value={hero.hero_title} onChange={(e) => setH('hero_title', e.target.value)} /></FormField>
                <FormField label="Gradient Title Line"><DashInput value={hero.hero_gradient} onChange={(e) => setH('hero_gradient', e.target.value)} /></FormField>
                <div className="md:col-span-2">
                  <FormField label="Subtitle"><DashTextarea value={hero.hero_subtitle} onChange={(e) => setH('hero_subtitle', e.target.value)} rows={3} /></FormField>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Hero Image"><div className="p-5 max-w-sm"><ImageUploadField value={hero.hero_image} onChange={(v) => setH('hero_image', v)} /></div></SectionCard>
          </>
        )}

        {tab === 'Why Us' && (
          <>
            <SectionCard title="Section Header">
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Title"><DashInput value={why.why_title} onChange={(e) => setW('why_title', e.target.value)} /></FormField>
                <FormField label="Subtitle"><DashInput value={why.why_subtitle} onChange={(e) => setW('why_subtitle', e.target.value)} /></FormField>
              </div>
            </SectionCard>
            <SectionCard title="Key Points">
              <div className="p-5 space-y-4">
                {[
                  { tKey: 'why_point1_title', dKey: 'why_point1_desc', n: '01' },
                  { tKey: 'why_point2_title', dKey: 'why_point2_desc', n: '02' },
                  { tKey: 'why_point3_title', dKey: 'why_point3_desc', n: '03' },
                ].map(({ tKey, dKey, n }) => (
                  <div key={n} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-mint-100 text-mint-700 font-bold text-xs flex items-center justify-center shrink-0">{n}</div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField label="Title"><DashInput value={(why as any)[tKey]} onChange={(e) => setW(tKey, e.target.value)} /></FormField>
                      <FormField label="Description"><DashInput value={(why as any)[dKey]} onChange={(e) => setW(dKey, e.target.value)} /></FormField>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
            <SectionCard title="Section Image"><div className="p-5 max-w-sm"><ImageUploadField value={why.why_image} onChange={(v) => setW('why_image', v)} /></div></SectionCard>
          </>
        )}

        {tab === 'SEO' && (
          <SectionCard title="SEO & Meta Tags">
            <div className="p-5 space-y-5">
              <FormField label="Meta Title" hint="50–60 chars recommended">
                <DashInput value={seo.meta_title} onChange={(e) => setS('meta_title', e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">{seo.meta_title.length} characters</p>
              </FormField>
              <FormField label="Meta Description" hint="150–160 chars recommended">
                <DashTextarea value={seo.meta_desc} onChange={(e) => setS('meta_desc', e.target.value)} rows={3} />
                <p className="text-xs text-gray-400 mt-1">{seo.meta_desc.length} characters</p>
              </FormField>
            </div>
          </SectionCard>
        )}
      </div>
    </div>
    </PermissionGuard>
  )
}
