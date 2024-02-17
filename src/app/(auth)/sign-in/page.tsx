'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

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
} from '@/components/ui/form'
import { login } from '@/actions/auth'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormStateMessage } from '@/components/auth/form-action-message'
import { cn } from '@/lib/utils'

const SignInPage = () => {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
      if (data.error) setError(data.error)

      if (data.success) {
        setSuccess(data.success)
        form.reset()
      }
    },
  })

  function onSubmit(values: TSignInValidator) {
    execute(values)
  }

  return (
    <CardWrapper
      of="sign-in"
      headerLabel="Enter your email below to log in."
      showSocial
      backButtonLabel="Don't have an account?"
      backButtonHref="/sign-in"
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
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
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
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </FormItem>
            )}
          />
          <FormStateMessage
            type={error ? 'error' : 'success'}
            message={success || error}
          />

          <Button
            type="submit"
            disabled={status === 'executing'}
            className="w-full"
          >
            Sign in to your account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}

export default SignInPage
