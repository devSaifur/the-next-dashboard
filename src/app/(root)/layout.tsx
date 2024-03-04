import { redirect } from 'next/navigation'
import { getStoreByUserId } from '@/data/store'
import { getUserAuth } from '@/auth/utils'

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = await getUserAuth()

  if (!session) redirect('/sign-in')

  const store = await getStoreByUserId(session.user.id)

  if (store) redirect(`/${store.id}`)

  return <>{children}</>
}
