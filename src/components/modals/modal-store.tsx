'use client'

import { Modal } from '@/components/ui/modal'
import { useModalStore } from '@/hooks/use-modal-store'
import { FormValidator, TFormValidator } from '@/lib/validators/FormValidators'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
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
import { createStoreAction } from '@/actions/create-store'
import { toast } from 'sonner'
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'

export const StoreModal = () => {
  const { isOpen, onOpen, onClose } = useModalStore()
  const router = useRouter()

  const form = useForm<TFormValidator>({
    resolver: zodResolver(FormValidator),
    defaultValues: {
      name: '',
    },
  })

  const { errors } = form.formState

  const { execute, status } = useAction(createStoreAction, {
    onSuccess(data) {
      if (data.error) toast.error(data.error)
      if (data.success) {
        toast.success(data.success)
        router.refresh()
      }
    },
  })

  const isPending = status === 'executing'

  async function onSubmit(values: TFormValidator) {
    execute(values)
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
                  {errors.name && (
                    <FormMessage>{errors.name.message}</FormMessage>
                  )}
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
