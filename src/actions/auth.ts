'use server'

import bcryptjs from 'bcryptjs'
import { v4 as uuid } from 'uuid'

import { createSafeActionClient } from 'next-safe-action'
import {
  SignInValidator,
  SignUpValidator,
} from '@/lib/validators/AuthValidators'
import { db } from '@/db'
import { users } from '@/db/schema'

const action = createSafeActionClient()

export const login = action(SignInValidator, async (values) => {
  const validatedFields = SignInValidator.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  console.log(values)

  return { success: 'Signed in successfully' }
})

export const register = action(SignUpValidator, async (values) => {
  const validatedFields = SignUpValidator.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields' }
  }

  const { name, email, password } = validatedFields.data

  // check user by email getUserByEmail()

  const hashedPassword = await bcryptjs.hash(password, 10)

  await db
    .insert(users)
    .values({ id: uuid(), name, email, password: hashedPassword })

  // generateVerificationToken()

  // sendVerificationEmail

  return { success: 'Signed up successfully' }
})
