import { redirect } from 'next/navigation'
import { validateRequest } from '@/auth/auth'
import { getStoreByUserId } from '@/data/store'
import { getUser } from '@/hooks/getUser'

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
