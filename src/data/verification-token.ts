// import { db } from '@/db'
// import { verificationTokens } from '@/db/schema'
// import { eq } from 'drizzle-orm'

// export async function getVerificationTokenByEmail(email: string) {
//   try {
//     const res = await db.query.verificationTokens.findFirst({
//       where: eq(verificationTokens.email, email),
//     })

//     return res
//   } catch (err) {
//     if (err instanceof Error) console.error(err.message)
//     return null
//   }
// }

// export async function getVerificationTokenByToken(token: string) {
//   try {
//     const res = await db.query.verificationTokens.findFirst({
//       where: eq(verificationTokens.token, token),
//     })

//     return res
//   } catch (err) {
//     if (err instanceof Error) console.error(err.message)
//     return null
//   }
// }
