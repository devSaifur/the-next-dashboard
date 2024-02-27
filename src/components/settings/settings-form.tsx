'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import {
  StoreUpdateSchema,
  TStoreUpdateSchema,
} from '@/lib/validators/ActionValidators'
import { TStoreInsertSchema } from '@/db/schema'
import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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

import { updateStoreAction } from '@/actions/store-update'
import { deleteStoreAction } from '@/actions/store-delete'

interface SettingsFormProps {
  initialData: TStoreInsertSchema
  storeId: string
}

export const SettingsForm = ({ initialData, storeId }: SettingsFormProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<TStoreUpdateSchema>({
    resolver: zodResolver(StoreUpdateSchema),
    defaultValues: {
      name: initialData.name,
      storeId,
    },
  })

  const { mutate: updateAction, isPending: isUpdating } = useMutation({
    mutationFn: updateStoreAction,
    mutationKey: ['stores'],
    onSuccess: ({ success, error }) => {
      if (error) toast.error(error)
      if (success) {
        toast.success(success)
        router.refresh()
      }
    },
  })

  const { mutate: deleteAction, isPending: isDeleting } = useMutation({
    mutationFn: deleteStoreAction,
    mutationKey: ['stores'],
    onSuccess: ({ success, error }) => {
      if (error) toast.error(error)
      if (success) {
        toast.success(success)
        router.refresh()
      }
    },
    onError: () => {
      toast.error('Something went wrong! Please try again.')
    },
  })

  const isPending = isUpdating || isDeleting

  function onSubmit(values: TStoreUpdateSchema) {
    updateAction(values)
  }

  function onDelete() {
    deleteAction(storeId)
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
          <Trash />
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
