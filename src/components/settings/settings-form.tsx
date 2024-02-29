'use client'

import axios, { isAxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'

import { StoreSchema, TStoreSchema } from '@/lib/validators/ActionValidators'
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

interface SettingsFormProps {
  initialData: TStoreInsertSchema
}

export const SettingsForm = ({ initialData }: SettingsFormProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  const storeId = params.storeId

  const form = useForm<TStoreSchema>({
    resolver: zodResolver(StoreSchema),
    defaultValues: initialData || {
      name: '',
    },
  })

  const { mutate: updateStore, isPending: isUpdating } = useMutation({
    mutationFn: async (data: TStoreSchema) =>
      await axios.patch(`/api/stores/${storeId}`, data),
    mutationKey: ['stores'],
    onSuccess: () => {
      router.refresh()
      toast.success('Store created successfully')
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data)
      } else {
        toast.error('Error, please try again.')
      }
    },
  })

  const { mutate: deleteStore, isPending: isDeleting } = useMutation({
    mutationFn: async () => await axios.delete(`/api/stores/${storeId}`),
    mutationKey: ['stores'],
    onSuccess: () => {
      router.push('/')
      toast.success('Store deleted successfully')
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data)
      } else {
        toast.error('Error, please try again.')
      }
    },
  })

  const isPending = isUpdating || isDeleting

  function onSubmit(values: TStoreSchema) {
    updateStore(values)
  }

  function onDelete() {
    deleteStore()
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
