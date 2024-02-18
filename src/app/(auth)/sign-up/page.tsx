'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  SignUpValidator,
  TSignUpValidator,
} from '@/lib/validators/AuthValidators'
import { register } from '@/actions/authActions'
import { FormStateMessage } from '@/components/auth/form-action-message'
import { CardWrapper } from '@/components/auth/card-wrapper'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export default function AuthenticationPage() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const form = useForm<TSignUpValidator>({
    resolver: zodResolver(SignUpValidator),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const { errors } = form.formState

  const { execute, status } = useAction(register, {
    onSuccess(data) {
      if (data.error) setError(data.error)

      if (data.success) {
        setSuccess(data.success)
        form.reset()
      }
    },
  })

  const isPending = status === 'executing'

  function onSubmit(values: TSignUpValidator) {
    execute(values)
  }

  return (
    <CardWrapper
      of="sign-up"
      headerLabel="Enter your email below to create an account"
      showSocial
      backButtonLabel="Have an account?"
      backButtonHref="/sign-in"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
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
                {errors.email && (
                  <FormMessage>{errors.email.message}</FormMessage>
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
                  <FormMessage> {errors.password.message}</FormMessage>
                )}
              </FormItem>
            )}
          />

          <FormStateMessage
            type={error ? 'error' : 'success'}
            message={success || error}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            Sign up with email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
