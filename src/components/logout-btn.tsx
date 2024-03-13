'use client'

import { LogOutIcon } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { logout } from '@/actions/logout'

export default function LogoutBtn() {
  return (
    <form action={logout}>
      <Btn />
    </form>
  )
}

const Btn = () => {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} variant="destructive" size="sm">
      <LogOutIcon className="mr-4 size-4" />
      Log{pending ? 'ing' : ''}out
    </Button>
  )
}
