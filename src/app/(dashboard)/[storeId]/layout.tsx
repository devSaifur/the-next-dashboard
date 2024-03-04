import { Navbar } from '@/components/Navbar'
import { getStoreById } from '@/data/store'
import { redirect } from 'next/navigation'
import { checkAuth } from '@/auth/utils'

export default async function Dashboard({
  children,
  params,
}: {
  children: React.ReactNode
  params: { storeId: string }
}) {
  await checkAuth()

  const store = await getStoreById(params.storeId)

  if (!store) redirect('/')

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
