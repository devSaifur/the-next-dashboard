'use server'

import { Argon2id } from 'oslo/password'
import { generateId } from 'lucia'
import { createSafeActionClient } from 'next-safe-action'
import { cookies } from 'next/headers'

import {
  SignInValidator,
  SignUpValidator,
} from '@/lib/validators/AuthValidators'
import { db } from '@/db'
import { User, users } from '@/db/schema'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'

import { DEFAULT_LOGIN_REDIRECT } from '@/auth/routes'
import { lucia } from '@/auth/auth'
import { redirect } from 'next/navigation'

const action = createSafeActionClient()

export const login = action(SignInValidator, async (values) => {
  const validatedFields = SignInValidator.safeParse(values)

  if (!validatedFields.success) {
    console.log(validatedFields.success)
    return { error: 'Invalid fields' }
  }

  const { email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Incorrect username or password' }
  }

  const validPassword = await new Argon2id().verify(
    existingUser.password,
    password
  )

  if (!validPassword) {
    return {
      error: 'Incorrect username or password',
    }
  }

  const session = await lucia.createSession(existingUser.id, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  )
})

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
