'use client'

import { ReactNode, useState } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { ROLES } from '@/lib/dashboard/mockDashData'

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeUp?: boolean
  icon: ReactNode
  accent?: string
}
export function StatCard({ title, value, change, changeUp = true, icon, accent = 'text-mint-600 bg-mint-50' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>{icon}</div>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${changeUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
            {changeUp ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-sm text-gray-400">{title}</p>
    </div>
  )
}

// ─── Section Card ─────────────────────────────────────────────────────────────
export function SectionCard({ title, action, children, className = '', noPad = false }:
  { title?: string; action?: ReactNode; children: ReactNode; className?: string; noPad?: boolean }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
          {title && <h2 className="text-sm font-semibold text-gray-800">{title}</h2>}
          {action}
        </div>
      )}
      <div className={noPad ? '' : ''}>{children}</div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusMap: Record<string, string> = {
  new:       'bg-blue-50 text-blue-700 border border-blue-100',
  read:      'bg-gray-50 text-gray-500 border border-gray-200',
  replied:   'bg-green-50 text-green-700 border border-green-100',
  contacted: 'bg-purple-50 text-purple-700 border border-purple-100',
  active:    'bg-green-50 text-green-700 border border-green-100',
  inactive:  'bg-gray-50 text-gray-400 border border-gray-200',
  published: 'bg-mint-50 text-mint-700 border border-mint-100',
  draft:     'bg-amber-50 text-amber-700 border border-amber-100',
}
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusMap[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status === 'new' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"/>}
      {status}
    </span>
  )
}

// ─── Role Badge ───────────────────────────────────────────────────────────────
export function RoleBadge({ role }: { role: string }) {
  const r = ROLES.find((r) => r.name === role)
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${r?.color ?? 'bg-gray-100 text-gray-600'}`}>
      {r?.label ?? role}
    </span>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────
export function DashTable({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            {headers.map((h) => (
              <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">{children}</tbody>
      </table>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, desc }: { icon: ReactNode; title: string; desc?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">{icon}</div>
      <p className="font-semibold text-gray-600 mb-1">{title}</p>
      {desc && <p className="text-sm text-gray-400 max-w-xs">{desc}</p>}
    </div>
  )
}

// ─── Page Header ─────────────────────────────────────────────────────────────
export function PageHeader({ title, desc, action }: { title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
      <div className="min-w-0">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{title}</h1>
        {desc && <p className="text-sm text-gray-400 mt-0.5">{desc}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Form Field ───────────────────────────────────────────────────────────────
export function FormField({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  )
}

// ─── Inputs ───────────────────────────────────────────────────────────────────
export function DashInput({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:border-transparent transition ${className}`}
      {...props}
    />
  )
}
export function DashTextarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={4}
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:border-transparent transition resize-none ${className}`}
      {...props}
    />
  )
}
export function DashSelect({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-mint-400 focus:border-transparent transition ${className}`}
      {...props}
    >{children}</select>
  )
}

// ─── Image Upload Field ───────────────────────────────────────────────────────
export function ImageUploadField({ value, onChange, label = 'Image' }: { value: string; onChange: (v: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('images').upload(fileName, file, { upsert: true })
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path)
        onChange(publicUrl)
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button onClick={() => onChange("")} className="absolute top-2 right-2 w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center text-gray-500 hover:text-red-500 text-xs font-bold transition">✕</button>
        </div>
      )}
      <DashInput value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image URL..." />
      <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed text-sm cursor-pointer transition ${uploading ? "border-mint-300 text-mint-500 bg-mint-50" : "border-gray-200 text-gray-400 hover:border-mint-400 hover:text-mint-500"}`}>
        <span className="text-base">{uploading ? "⏳" : "↑"}</span>
        {uploading ? "Uploading..." : "Upload from device"}
        <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileUpload(file)
        }} />
      </label>
    </div>
  )
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
export function ConfirmModal({ open, title, desc, onConfirm, onCancel }: { open: boolean; title: string; desc?: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 border border-gray-100">
        <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
        {desc && <p className="text-gray-400 text-sm mb-6">{desc}</p>}
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition">Delete</button>
        </div>
      </div>
    </div>
  )
}

// ─── Save Button ──────────────────────────────────────────────────────────────
export function SaveButton({ saved, onClick, label = 'Save Changes' }: { saved: boolean; onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition w-full ${saved ? 'bg-green-500 text-white' : 'bg-mint-600 hover:bg-mint-700 text-white'}`}>
      {saved ? '✓ Saved!' : label}
    </button>
  )
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit max-w-full overflow-x-auto">
      {tabs.map((t) => (
        <button key={t} onClick={() => onChange(t)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${active === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          {t}
        </button>
      ))}
    </div>
  )
}
