'use server'

import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    return user
  } catch (err) {
    if (err instanceof Error) console.error(err.message)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    })
    return user
  } catch (err) {
    if (err instanceof Error) console.error(err.message)
    return null
  }
}
