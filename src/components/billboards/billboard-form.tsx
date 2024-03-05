'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Axe, Trash } from 'lucide-react'
import { toast } from 'sonner'
import axios, { isAxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TBillboardSelectSchema } from '@/db/schema'
import {
  BillboardSchema,
  TBillboardSchema,
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
import ImageUpload from '@/components/image-upload'
import { useMutation } from '@tanstack/react-query'

interface BillboardFormProps {
  initialData: TBillboardSelectSchema | undefined
}

export const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  const storeId = params.storeId as string
  const billboardId = params.billboardId as string

  const title = initialData ? 'Edit billboard' : 'Create billboard'
  const description = initialData ? 'Edit a billboard' : 'Add a new billboard'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<TBillboardSchema>({
    resolver: zodResolver(BillboardSchema),
    defaultValues: initialData || {
      label: '',
      imageUrl: '',
    },
  })

  const { mutate: createBillboard, isPending: isCreating } = useMutation({
    mutationKey: ['billboards'],
    mutationFn: async (data: TBillboardSchema) =>
      await axios.post(`/api/${storeId}/billboards`, data),
    onSuccess: () => {
      toast.success('Billboard crated successfully')
      router.push(`/${storeId}/billboards`)
      router.refresh()
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data)
      } else {
        toast.error('Error, please try again.')
      }
    },
  })

  const { mutate: updateBillboard, isPending: isUpdating } = useMutation({
    mutationKey: ['billboards'],
    mutationFn: async (data: TBillboardSchema) =>
      await axios.patch(`/api/${storeId}/billboards/${billboardId}`, data),
    onSuccess: () => {
      toast.success('Billboard updated successfully')
      router.push(`/${storeId}/billboards`)
      router.refresh()
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data)
      } else {
        toast.error('Error, please try again.')
      }
    },
  })

  const { mutate: deleteBillboard, isPending: isDeleting } = useMutation({
    mutationKey: ['billboards'],
    mutationFn: async () =>
      await axios.delete(`/api/${storeId}/billboards/${billboardId}`),
    onSuccess: () => {
      toast.success('Billboard deleted successfully')
      router.push(`/${storeId}/billboards`)
      router.refresh()
    },
    onError: (err) => {
      if (isAxiosError(err)) {
        toast.error(err.response?.data)
      } else {
        toast.error('Error, please try again.')
      }
    },
  })

  const isPending = isCreating || isUpdating || isDeleting

  function onSubmit(values: TBillboardSchema) {
    if (initialData) {
      updateBillboard(values)
    } else {
      createBillboard(values)
    }
  }

  function onDelete() {
    deleteBillboard()
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
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            onClick={() => setOpen(true)}
            variant="destructive"
            size="icon"
          >
            <Trash />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isPending}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Billboard name"
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
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
