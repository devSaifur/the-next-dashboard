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
import { TSizeSelectSchema } from '@/db/schema'
import { SizeSchema, TSizeSchema } from '@/lib/validators/FormValidators'
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

interface SizeFormProps {
  initialData: TSizeSelectSchema | undefined
}

export const SizeForm = ({ initialData }: SizeFormProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  const storeId = params.storeId as string
  const sizeId = params.sizeId as string

  const title = initialData ? 'Edit Size' : 'Create Size'
  const description = initialData ? 'Edit a Size' : 'Add a new Size'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<TSizeSchema>({
    resolver: zodResolver(SizeSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  })

  const { mutate: createSize, isPending: isCreating } = useMutation({
    mutationKey: ['sizes'],
    mutationFn: async (data: TSizeSchema) =>
      await axios.post(`/api/${storeId}/sizes`, data),

    onSuccess: () => {
      toast.success('Size crated successfully')
      router.push(`/${storeId}/sizes`)
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

  const { mutate: updateSize, isPending: isUpdating } = useMutation({
    mutationKey: ['sizes'],
    mutationFn: async (data: TSizeSchema) =>
      await axios.patch(`/api/${storeId}/sizes/${sizeId}`, data),

    onSuccess: () => {
      toast.success('Size updated successfully')
      router.push(`/${storeId}/sizes`)
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

  const { mutate: deleteSize, isPending: isDeleting } = useMutation({
    mutationKey: ['sizes'],
    mutationFn: async () =>
      await axios.delete(`/api/${storeId}/sizes/${sizeId}`),

    onSuccess: () => {
      toast.success('Size deleted successfully')
      router.push(`/${storeId}/sizes`)
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

  function onSubmit(values: TSizeSchema) {
    if (initialData) {
      updateSize(values)
    } else {
      createSize(values)
    }
  }

  function onDelete() {
    deleteSize()
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
                      placeholder="Size name"
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
                    <Input
                      placeholder="Size value"
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
