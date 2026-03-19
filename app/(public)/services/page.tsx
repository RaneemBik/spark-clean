import { getServices } from '@/lib/supabase/queries'
import ServicesClient from '@/components/pages/ServicesClient'
export default async function ServicesPage() {
  const services = await getServices()
  return <ServicesClient services={services} />
}
