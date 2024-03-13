'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  SignInValidator,
  TSignInValidator,
} from '@/lib/validators/AuthValidators'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { login } from '@/actions/login'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormActionError } from '@/components/auth/form-action-message'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'

const SignInPage = () => {
  const [error, setError] = useState('')
  const form = useForm<TSignInValidator>({
    resolver: zodResolver(SignInValidator),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { errors } = form.formState

  const { execute, status } = useAction(login, {
    onSuccess(data) {
      if (data?.error) setError(data.error)
    },
    onError() {
      toast.error('Error, something went wrong.')
    },
  })

  const isPending = status === 'executing'

  function onSubmit(values: TSignInValidator) {
    execute(values)
  }

  return (
    <CardWrapper
      of="sign-in"
      headerLabel="Enter your email below to log in."
      showSocial
      backButtonLabel="Don't have an account?"
      backButtonHref="/sign-up"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormActionError message={error} />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Icons.spinner className="h-4 w-4 animate-spin" />}
            Sign in to your account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default SignInPage
