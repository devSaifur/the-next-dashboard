import { Navbar } from '@/components/Navbar'
import { getStoreByStoreId } from '@/data/store'
import { getUser } from '@/hooks/getUser'
import { redirect } from 'next/navigation'

export default async function Dashboard({
  children,
  params,
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  const user = await getUser()
  if (!user) redirect('/sign-in')

  const store = await getStoreByStoreId(params.storeId)

  if (!store) redirect('/')

  return (
    <main>
      <Navbar />
      {children}
    </main>
  )
}
