'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

import { Heading } from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TBillboardSelectSchema, TCategorySelectSchema } from '@/db/schema'
import {
  CategoryCreateUpdateSchema,
  TCategoryCreateUpdateSchema,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { deleteBillboardAction } from '@/actions/billboard-delete'
import { createCategoryAction } from '@/actions/category-create'
import { updateCategoryAction } from '@/actions/category-update'
import { deleteCategoryAction } from '@/actions/category-delete'

interface CategoryFormProps {
  initialData: TCategorySelectSchema | null
  billboards: TBillboardSelectSchema[]
}

export const CategoryForm = ({
  initialData,
  billboards,
}: CategoryFormProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  const storeId = params.storeId as string
  const categoryId = params.categoryId as string

  const title = initialData ? 'Edit billboard' : 'Create billboard'
  const description = initialData ? 'Edit a billboard' : 'Add a new billboard'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<TCategoryCreateUpdateSchema>({
    resolver: zodResolver(CategoryCreateUpdateSchema),
    defaultValues: {
      storeId: storeId, // this is for passing storeId in server action
      categoryId: categoryId, // and this too
      name: initialData?.name || '',
      billboardId: initialData?.billboardId || '',
    },
  })

  const { mutate: createCategory, isPending: isCreating } = useMutation({
    mutationKey: ['categories'],
    mutationFn: createCategoryAction,
    onSuccess: ({ error, success }) => {
      if (error) toast.error(error)
      if (success) {
        toast.success(success)
        router.push(`/${storeId}/categories`)
        router.refresh()
      }
    },
  })

  const { mutate: updateCategory, isPending: isUpdating } = useMutation({
    mutationKey: ['categories'],
    mutationFn: updateCategoryAction,
    onSuccess: ({ error, success }) => {
      if (error) toast.error(error)
      if (success) {
        toast.success(success)
        router.push(`/${storeId}/categories`)
        router.refresh()
      }
    },
  })

  const { mutate: deleteBillboard, isPending: isDeleting } = useMutation({
    mutationKey: ['categories'],
    mutationFn: deleteCategoryAction,
    onSuccess: ({ error, success }) => {
      if (error) toast.error(error)
      if (success) {
        toast.success(success)
        router.push(`/${storeId}/`)
        router.refresh()
      }
    },
  })

  const isPending = isCreating || isUpdating || isDeleting

  function onSubmit(values: TCategoryCreateUpdateSchema) {
    if (initialData) {
      updateCategory(values)
    } else {
      createCategory(values)
    }
  }

  function onDelete() {
    deleteBillboard({ storeId, categoryId })
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
                      placeholder="Category name"
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
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a billboard"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {billboards.map((billboard) => (
                          <SelectItem value={billboard.id} key={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
