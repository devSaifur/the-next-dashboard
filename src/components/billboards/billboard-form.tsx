'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { BillboardInsertSchema, TBillboardInsertSchema } from '@/db/schema'
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

interface BillboardFormProps {
  initialData: TBillboardInsertSchema
  billboardId: string
}

export const BillboardForm = ({
  initialData,
  billboardId,
}: BillboardFormProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<TBillboardInsertSchema>({
    resolver: zodResolver(BillboardInsertSchema),
    defaultValues: {
      label: initialData.label,
      imageUrl: initialData.imageUrl,
      storeId: billboardId,
    },
  })

  function onSubmit(values: TBillboardInsertSchema) {}

  function onDelete() {}

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
            Save changes
          </Button>
        </form>
      </Form>
    </>
  )
}
