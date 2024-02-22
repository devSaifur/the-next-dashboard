'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrashIcon } from '@radix-ui/react-icons'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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
import { AlertModal } from '@/components/modals/alert-modals'

import { updateStoreAction } from '@/actions/update-store'
import { deleteStoreAction } from '@/actions/delete-store'

interface SettingsFormPage {
  initialData: Store
  storeId: string
}

export const SettingsForm = ({ initialData, storeId }: SettingsFormPage) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<TSettingsFormValidator>({
    resolver: zodResolver(SettingsFormValidator),
    defaultValues: {
      name: initialData.name,
      storeId,
    },
  })

  const { execute: executeUpdate, status: updateStatus } = useAction(
    updateStoreAction,
    {
      onSuccess(data) {
        if (data.error) toast.error(data.error)
        if (data.success) {
          toast.success(data.success)
          router.refresh()
        }
      },
    }
  )

  const { execute: executeDelete, status: deleteStatus } = useAction(
    deleteStoreAction,
    {
      onSuccess(data) {
        if (data.error) toast.error(data.error)
        if (data.success) {
          toast.success(data.success)
          router.refresh()
        }
      },
    }
  )

  const isPending = updateStatus === 'executing' || deleteStatus === 'executing'

  function onSubmit(values: TSettingsFormValidator) {
    executeUpdate(values)
  }

  function onDelete() {
    executeDelete(storeId)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <div className="flex items-center justify-between">
        <Heading title="Settings" description="Manage store preferences" />
        <Button onClick={() => setOpen(true)} variant="destructive" size="icon">
          <TrashIcon />
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
