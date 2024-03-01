import { Navbar } from '@/components/Navbar'
import { getStoreById } from '@/data/store'
import { getUser } from '@/auth/getUser'
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

  const store = await getStoreById(params.storeId)

  if (!store) redirect('/')

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
