import * as z from 'zod'

export const SignUpValidator = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({
    message: 'Invalid email address!',
  }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
})

export type TSignUpValidator = z.infer<typeof SignUpValidator>

export const SignInValidator = z.object({
  email: z.string().email({
    message: 'Invalid email address!',
  }),
  password: z.string().min(6, { message: 'Invalid password' }),
})

export type TSignInValidator = z.infer<typeof SignInValidator>
