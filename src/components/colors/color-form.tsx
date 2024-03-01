'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import axios, { isAxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TColorSelectSchema } from '@/db/schema'
import { ColorSchema, TColorSchema } from '@/lib/validators/ActionValidators'
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
import { useMutation } from '@tanstack/react-query'

interface ColorFormProps {
  initialData: TColorSelectSchema | undefined
}

export const ColorForm = ({ initialData }: ColorFormProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  const storeId = params.storeId as string
  const colorId = params.colorId as string

  const title = initialData ? 'Edit Color' : 'Create Color'
  const description = initialData ? 'Edit a Color' : 'Add a new Color'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<TColorSchema>({
    resolver: zodResolver(ColorSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  })

  const { mutate: createColor, isPending: isCreating } = useMutation({
    mutationKey: ['colors'],
    mutationFn: async (data: TColorSchema) =>
      await axios.post(`/api/${storeId}/colors`, data),

    onSuccess: () => {
      toast.success('Color crated successfully')
      router.push(`/${storeId}/colors`)
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

  const { mutate: updateColor, isPending: isUpdating } = useMutation({
    mutationKey: ['colors'],
    mutationFn: async (data: TColorSchema) =>
      await axios.patch(`/api/${storeId}/colors/${colorId}`, data),

    onSuccess: () => {
      toast.success('Color updated successfully')
      router.push(`/${storeId}/colors`)
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

  const { mutate: deleteColor, isPending: isDeleting } = useMutation({
    mutationKey: ['colors'],
    mutationFn: async () =>
      await axios.delete(`/api/${storeId}/colors/${colorId}`),

    onSuccess: () => {
      toast.success('Color deleted successfully')
      router.push(`/${storeId}/colors`)
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

  function onSubmit(values: TColorSchema) {
    if (initialData) {
      updateColor(values)
    } else {
      createColor(values)
    }
  }

  function onDelete() {
    deleteColor()
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
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Color name"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-x-6">
                      <Input
                        placeholder="Color value"
                        disabled={isPending}
                        {...field}
                      />
                      <div
                        className="rounded-full border p-4"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
