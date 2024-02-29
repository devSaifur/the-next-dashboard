import { redirect } from 'next/navigation'
import { getStoreByUserId } from '@/data/store'
import { getUser } from '@/auth/getUser'

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) redirect('/sign-in')

  const store = await getStoreByUserId(user.userId)

  if (store) redirect(`/${store.id}`)

  return <>{children}</>
}
