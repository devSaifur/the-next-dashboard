import 'server-only'

import { redirect } from 'next/navigation'
import { validateRequest } from './auth'
import { cache } from 'react'

export type AuthSession = {
  session: {
    user: {
      id: string
      name?: string
      email?: string
    }
  } | null
}
export const getUserAuth = cache(async (): Promise<AuthSession> => {
  const { session, user } = await validateRequest()
  if (!session) return { session: null }
  return {
    session: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    },
  }
})

export const checkAuth = cache(async () => {
  const { session } = await validateRequest()
  if (!session) redirect('/sign-in')
})
