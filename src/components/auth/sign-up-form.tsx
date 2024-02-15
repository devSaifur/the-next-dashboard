'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  SignUpValidator,
  TSignUpValidator,
} from '@/lib/validators/AuthValidators'
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Icons } from '../icons'
import { CardWrapper } from './card-wrapper'

export function SignUpForm() {
  const form = useForm<TSignUpValidator>({
    resolver: zodResolver(SignUpValidator),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const { errors } = form.formState

  const isLoading = false

  return (
    <CardWrapper
      of="sign-up"
      headerLabel="Enter your email below to create an account"
      showSocial
      backButtonLabel="Have an account?"
      backButtonHref="/sign-in"
    >
      <Form {...form}>
        <div className="grid gap-6">
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Clark Kent"
                      disabled={false}
                      className={cn({
                        'focus-visible:ring-red-500': errors.name,
                      })}
                      {...field}
                    />
                  </FormControl>
                  {errors.name && <p>{errors.name.message}</p>}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@email.com"
                      disabled={false}
                      className={cn({
                        'focus-visible:ring-red-500': errors.email,
                      })}
                      {...field}
                    />
                  </FormControl>
                  {errors.email && <p>{errors.email.message}</p>}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="******"
                      type="password"
                      disabled={false}
                      className={cn({
                        'focus-visible:ring-red-500': errors.password,
                      })}
                      {...field}
                    />
                  </FormControl>
                  {errors.password && <p>{errors.password.message}</p>}
                </FormItem>
              )}
            />
          </form>
          <div>
            <Button className="w-full">Sign up with email</Button>
          </div>
        </div>
      </Form>
    </CardWrapper>
  )
}
