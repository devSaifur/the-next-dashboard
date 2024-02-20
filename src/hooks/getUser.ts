import { validateRequest } from '@/auth/auth'

export async function getUser() {
  const { session } = await validateRequest()
  if (!session) return null

  return session
}
