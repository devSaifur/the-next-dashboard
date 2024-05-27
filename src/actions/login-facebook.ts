import { facebook } from '@/auth/utils'
import { env } from '@/lib/env'
import { generateState } from 'arctic'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginFacebook() {
  const state = generateState()
  const url = (await facebook.createAuthorizationURL(state)) as any as string

  try {
    cookies().set('facebook_oauth_state', state, {
      path: '/',
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: 'lax',
    })
    redirect(url)
  } catch (err) {
    console.error(err)
    throw err
  }
}
