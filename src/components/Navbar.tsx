import { MainNav } from '@/components/MainNav'
import StoreSwitcher from '@/components/store-switcher'
import { getAllStoreByUserId } from '@/data/store'
import { redirect } from 'next/navigation'
import { getUserAuth } from '@/auth/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import LogoutBtn from '@/components/logout-btn'

export const Navbar = async () => {
  const { session } = await getUserAuth()
  if (!session) redirect('/sign-in')

  const stores = await getAllStoreByUserId(session.user.id)

  return (
    <div className="border-b ">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback>
                  {session.user.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <LogoutBtn />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
