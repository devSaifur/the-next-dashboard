import { MainNav } from '@/components/MainNav'
import StoreSwitcher from '@/components/store-switcher'
import { getAllStoreByUserId } from '@/data/store'
import { redirect } from 'next/navigation'
import { getUserAuth } from '@/auth/utils'

export const Navbar = async () => {
  const { session } = await getUserAuth()
  if (!session) redirect('/sign-in')

  const stores = await getAllStoreByUserId(session.user.id)

  return (
    <div className="border-b ">
      <div className="flex h-16 items-center px-4">
        {stores ? <StoreSwitcher items={stores} /> : null}
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">UserButton</div>
      </div>
    </div>
  )
}
