'use server'

import { generateId } from 'lucia'
import { createSafeActionClient } from 'next-safe-action'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Argon2id } from 'oslo/password'

import { lucia } from '@/auth/auth'
import { getUserByEmail } from '@/data/user'
import { db } from '@/db'
import { users } from '@/db/schema'
import { SignUpValidator } from '@/lib/validators/AuthValidators'

const action = createSafeActionClient()

export const register = action(SignUpValidator, async (values) => {
  const validatedFields = SignUpValidator.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name, email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (existingUser) {
    return { error: 'Email already in use!' }
  }

  const hashedPassword = await new Argon2id().hash(password)
  const userId = generateId(15)

  try {
    await db
      .insert(users)
      .values({ id: userId, name, email, password: hashedPassword })

    const session = await lucia.createSession(userId, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
  } catch (err) {
    if (err instanceof Error) console.error(err.message)
    console.error(err)
    return { error: 'An unknown error occurred' }
  }
  return redirect('/sign-in')
})
