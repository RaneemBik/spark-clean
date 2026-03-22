'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Eye, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { updateService } from '@/lib/supabase/actions'
import { PageHeader, SectionCard, FormField, DashInput, DashTextarea, Tabs } from '@/components/dashboard/DashUI'
import { PermissionGuard } from '@/components/dashboard/PermissionGuard'

export default function ServicesDashClient({ initialServices }: { initialServices: any[] }) {
  const [services, setServices] = useState(initialServices.map((s) => ({ ...s, expanded: false })))
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const totalPages = Math.ceil(services.length / itemsPerPage)
  const paginatedServices = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const update = (id: string, key: string, value: string) =>
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, [key]: value } : s))

  const updateFeature = (id: string, i: number, value: string) =>
    setServices((prev) => prev.map((s) => {
      if (s.id !== id) return s
      const features = [...s.features]; features[i] = value
      return { ...s, features }
    }))

  const addFeature = (id: string) =>
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, features: [...s.features, ''] } : s))

  const removeFeature = (id: string, i: number) =>
    setServices((prev) => prev.map((s) => s.id !== id ? s : { ...s, features: s.features.filter((_: any, j: number) => j !== i) }))

  const toggle = (id: string) =>
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, expanded: !s.expanded } : s))

  const handleSave = (service: any) => {
    setSaving(service.id)
    startTransition(async () => {
      await updateService(service.id, {
        title: service.title,
        description: service.description,
        price_note: service.price_note,
        features: service.features,
      })
      setSaving(null)
      setSaved(service.id)
      setTimeout(() => setSaved(null), 1500)
    })
  }

  return (
    <PermissionGuard permission="edit_services">
      <div>
      <PageHeader
        title="Services"
        desc="Edit all service offerings"
        action={
          <Link href="/services" target="_blank" className="flex items-center gap-2 border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
            <Eye className="w-4 h-4" /> Preview Services Page
          </Link>
        }
      />

      <div className="space-y-4">
        {paginatedServices.map((service) => (
          <SectionCard key={service.id}>
            <button onClick={() => toggle(service.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left">
              <div>
                <p className="font-semibold text-gray-800">{service.title}</p>
                <p className="text-xs text-mint-600 font-medium mt-0.5">{service.price_note}</p>
              </div>
              {service.expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {service.expanded && (
              <div className="px-5 pb-5 space-y-4 border-t border-gray-50">
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Service Title">
                    <DashInput value={service.title} onChange={(e) => update(service.id, 'title', e.target.value)} />
                  </FormField>
                  <FormField label="Price / Note">
                    <DashInput value={service.price_note} onChange={(e) => update(service.id, 'price_note', e.target.value)} />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="Description">
                      <DashTextarea value={service.description} onChange={(e) => update(service.id, 'description', e.target.value)} rows={3} />
                    </FormField>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-gray-700">Features / What's Included</p>
                    <button onClick={() => addFeature(service.id)} className="text-xs text-mint-600 hover:text-mint-700 flex items-center gap-1 font-medium">
                      <Plus className="w-3 h-3" /> Add feature
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(service.features as string[]).map((feat, i) => (
                      <div key={i} className="flex gap-2">
                        <DashInput value={feat} onChange={(e) => updateFeature(service.id, i, e.target.value)} placeholder={`Feature ${i + 1}`} />
                        <button onClick={() => removeFeature(service.id, i)} className="w-9 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button onClick={() => handleSave(service)} disabled={saving === service.id}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${saved === service.id ? 'bg-green-500 text-white' : 'bg-mint-600 hover:bg-mint-700 text-white'}`}>
                    {saving === service.id ? 'Saving...' : saved === service.id ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </SectionCard>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                currentPage === page
                  ? 'bg-mint-600 text-white'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
    </PermissionGuard>
  )
}
