'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LuTrash } from 'react-icons/lu'

import { Store } from '@/db/schema'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  SettingsFormValidator,
  TSettingsFormValidator,
} from '@/lib/validators/FormValidators'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAction } from 'next-safe-action/hooks'
import { updateStore } from '@/actions/update-store'

interface SettingsFormPage {
  initialData: Store
  storeId: string
}

export const SettingsForm = ({ initialData, storeId }: SettingsFormPage) => {
  const [open, setOpen] = useState(false)

  const form = useForm<TSettingsFormValidator>({
    resolver: zodResolver(SettingsFormValidator),
    defaultValues: {
      name: initialData.name,
      storeId,
    },
  })

  const { execute, status } = useAction(updateStore, {
    onSuccess(data) {},
  })

  const isPending = status === 'executing'

  function onSubmit(values: TSettingsFormValidator) {
    execute(values)
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button variant="destructive" size="icon">
          <LuTrash />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Store name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isPending} className="ml-auto">
            Save changes
          </Button>
        </form>
      </Form>
    </>
  )
}
