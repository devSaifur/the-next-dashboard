import { MainNav } from '@/components/MainNav'
import StoreSwitcher from '@/components/store-switcher'
import { getAllStoreByUserId } from '@/data/store'
import { getUser } from '@/hooks/getUser'
import { redirect } from 'next/navigation'

export const Navbar = async () => {
  const user = await getUser()
  if (!user) redirect('/sign-in')

  const { userId } = user

  const stores = await getAllStoreByUserId(userId)

  return (
    <div className="border-b ">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">UserButton</div>
      </div>
    </div>
  )
}
