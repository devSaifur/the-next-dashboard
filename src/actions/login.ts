'use server'

import { Argon2id } from 'oslo/password'
import { createSafeActionClient } from 'next-safe-action'
import { cookies } from 'next/headers'
import { lucia } from '@/auth/auth'
import { redirect } from 'next/navigation'

import { SignInValidator } from '@/lib/validators/AuthValidators'
import { getUserByEmail } from '@/data/user'

const action = createSafeActionClient()

export const login = action(SignInValidator, async (values) => {
  const validatedFields = SignInValidator.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { email, password } = validatedFields.data

  try {
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

    console.log({ session }, { sessionCookie })

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    )
    return redirect('/')
  } catch (err) {
    return { error: 'Something went wrong, please try again' }
  }
})
