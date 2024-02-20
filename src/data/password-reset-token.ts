// import { db } from '@/db'
// import { passwordResetTokens } from '@/db/schema'
// import { eq } from 'drizzle-orm'

// export async function getPasswordResetTokenByEmail(email: string) {
//   try {
//     const res = await db.query.passwordResetTokens.findFirst({
//       where: eq(passwordResetTokens.email, email),
//     })
//     return res
//   } catch (err) {
//     if (err instanceof Error) console.error(err.message)
//     return null
//   }
// }

// export async function getPasswordResetTokenByToken(token: string) {
//   try {
//     const res = await db.query.passwordResetTokens.findFirst({
//       where: eq(passwordResetTokens.token, token),
//     })

//     return res
//   } catch (err) {
//     if (err instanceof Error) console.error(err.message)
//     return null
//   }
// }
