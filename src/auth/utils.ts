import 'server-only'

import { Facebook } from 'arctic'
import { redirect } from 'next/navigation'
import { validateRequest } from './auth'
import { env } from '@/lib/env'

export type AuthSession = {
  session: {
    user: {
      id: string
      name?: string
      email?: string
    }
  } | null
}
export const getUserAuth = async (): Promise<AuthSession> => {
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
}

export const checkAuth = async () => {
  const { session } = await validateRequest()
  if (!session) redirect('/sign-in')
}

export const facebook = new Facebook(
  env.FACEBOOK_CLIENT_ID,
  env.FACEBOOK_CLIENT_SECRET,
  'http://loaclhost:3000'
)
