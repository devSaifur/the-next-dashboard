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
import {
  TCategorySelectSchema,
  TColorSelectSchema,
  TImageSelectSchema,
  TProductSelectSchema,
  TSizeSelectSchema,
} from '@/db/schema'
import { ProductSchema, TProductSchema } from '@/lib/validators/FormValidators'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modals'
import { Checkbox } from '@/components/ui/checkbox'
import { useMutation } from '@tanstack/react-query'
import ImageUpload from '@/components/image-upload'

interface ProductFormProps {
  initialData:
    | (TProductSelectSchema & {
        images: TImageSelectSchema[]
      })
    | undefined
  categories: TCategorySelectSchema[]
  sizes: TSizeSelectSchema[]
  colors: TColorSelectSchema[]
}

export const ProductForm = ({
  initialData,
  categories,
  sizes,
  colors,
}: ProductFormProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  const storeId = params.storeId as string
  const productId = params.productId as string

  const title = initialData ? 'Edit product' : 'Create product'
  const description = initialData ? 'Edit a product' : 'Add a new product'
  const action = initialData ? 'Save changes' : 'Create'

  const form = useForm<TProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData
      ? { ...initialData, price: parseFloat(String(initialData.price)) }
      : {
          name: '',
          images: [],
          price: 0,
          isArchived: false,
          isFeatured: false,
          colorId: '',
          sizeId: '',
          categoryId: '',
        },
  })

  const { mutate: createProduct, isPending: isCreating } = useMutation({
    mutationKey: ['products'],
    mutationFn: async (data: TProductSchema) =>
      await axios.post(`/api/${storeId}/products`, data),
    onSuccess: () => {
      toast.success('Product crated successfully')
      router.push(`/${storeId}/products`)
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

  const { mutate: updateProduct, isPending: isUpdating } = useMutation({
    mutationKey: ['products'],
    mutationFn: async (data: TProductSchema) =>
      await axios.patch(`/api/${storeId}/products/${productId}`, data),
    onSuccess: () => {
      toast.success('Product updated successfully')
      router.push(`/${storeId}/products`)
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

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationKey: ['products'],
    mutationFn: async () =>
      await axios.delete(`/api/${storeId}/products/${productId}`),
    onSuccess: () => {
      toast.success('Product deleted successfully')
      router.push(`/${storeId}/products`)
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

  function onSubmit(values: TProductSchema) {
    if (initialData) {
      updateProduct(values)
    } else {
      createProduct(values)
    }
  }

  function onDelete() {
    deleteProduct()
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
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={isPending}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Product Name"
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="9.99"
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
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
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem value={category.id} key={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
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
                            placeholder="Select a size"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem value={size.id} key={size.id}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
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
                            placeholder="Select a color"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((color) => (
                          <SelectItem value={color.id} key={color.id}>
                            {color.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear in the home page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value as boolean}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
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
