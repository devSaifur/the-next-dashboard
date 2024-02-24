'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TBillboardSelectSchema } from '@/db/schema'
import {
  BillboardCreateUpdateSchema,
  TBillboardCreateUpdateSchema,
} from '@/lib/validators/ActionValidators'
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
import { createBillboardAction } from '@/actions/billboard-create'
import { updateBillboardAction } from '@/actions/billboard-update'
import { deleteBillboardAction } from '@/actions/billboard-delete'

interface BillboardFormProps {
  initialData: TBillboardSelectSchema | null
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

  const form = useForm<TBillboardCreateUpdateSchema>({
    resolver: zodResolver(BillboardCreateUpdateSchema),
    defaultValues: {
      storeId: storeId, // this is for passing storeId in server action
      billboardId: billboardId, // and this too
      label: initialData?.label || '',
      imageUrl: initialData?.imageUrl || '',
    },
  })

  const { mutate: createBillboard, isPending: isCreating } = useMutation({
    mutationKey: ['billboards'],
    mutationFn: createBillboardAction,
    onSuccess: ({ error, success }) => {
      if (error) toast.error(error)
      if (success) {
        toast.success(success)
        router.push(`/${storeId}/billboards`)
        router.refresh()
      }
    },
  })

  const { mutate: updateBillboard, isPending: isUpdating } = useMutation({
    mutationKey: ['billboards'],
    mutationFn: updateBillboardAction,
    onSuccess: ({ error, success }) => {
      if (error) toast.error(error)
      if (success) {
        toast.success(success)
        router.push(`/${storeId}/billboards`)
        router.refresh()
      }
    },
  })

  const { mutate: deleteBillboard, isPending: isDeleting } = useMutation({
    mutationKey: ['billboards'],
    mutationFn: deleteBillboardAction,
    onSuccess: ({ error, success }) => {
      if (error) toast.error(error)
      if (success) {
        toast.success(success)
        router.push(`/${storeId}/billboards`)
        router.refresh()
      }
    },
  })

  const isPending = isCreating || isUpdating || isDeleting

  function onSubmit(values: TBillboardCreateUpdateSchema) {
    if (initialData) {
      updateBillboard(values)
    } else {
      createBillboard(values)
    }
  }

  function onDelete() {
    deleteBillboard({ storeId, billboardId })
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
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
