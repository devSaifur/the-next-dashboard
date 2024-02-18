import { getVerificationTokenByEmail } from '@/data/verification-token'
import { db } from '@/db'
import { passwordResetTokens, verificationTokens } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuid } from 'uuid'

export async function generateVerificationToken(email: string) {
  const token = uuid()
  const expires = new Date(new Date().getTime() + 3000 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.email, email))
  }

  return await db
    .insert(verificationTokens)
    .values({ token, expires, email })
    .returning()
    .then((insertedTokens) => {
      return insertedTokens[0]
    })
    .catch((err) => {
      console.error(err.message)
    })
}

export async function generatePasswordResetToken(email: string) {
  const token = uuid()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.email, email))
  }

  const passwordResetToken = await db
    .insert(passwordResetTokens)
    .values({ token, expires, email })
    .returning()

  return passwordResetToken
}
