'use client'

import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { Modal } from '@/components/ui/modal'
import { useModalStore } from '@/hooks/use-modal-store'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '../ui/button'
import { createStoreAction } from '@/actions/store-create'
import {
  StoreCreateSchema,
  TStoreCreateSchema,
} from '@/lib/validators/ActionValidators'
import { useMutation } from '@tanstack/react-query'

export const StoreModal = () => {
  const { isOpen, onClose } = useModalStore()
  const router = useRouter()

  const form = useForm<TStoreCreateSchema>({
    resolver: zodResolver(StoreCreateSchema),
    defaultValues: {
      name: '',
    },
  })

  const { mutate: createAction, isPending } = useMutation({
    mutationKey: ['stores'],
    mutationFn: createStoreAction,
    onSuccess: ({ success, error }) => {
      if (error) toast.error(error)
      if (success) {
        onClose()
        toast.success(success)
        router.refresh()
      }
    },
  })

  function onSubmit(values: TStoreCreateSchema) {
    createAction(values)
  }

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="E-Commerce"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end space-x-2 pt-6">
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  onClose()
                }}
                variant="outline"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  )
}
