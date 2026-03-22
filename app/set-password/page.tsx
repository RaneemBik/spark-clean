import SetPasswordClient from '@/components/auth/SetPasswordClient'

export default function Page({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams?.token ?? null
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6">
        <SetPasswordClient token={token} />
      </div>
    </div>
  )
}
