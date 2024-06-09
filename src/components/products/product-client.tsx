'use client'

import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { ProductColumn } from './product-columns'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/products/product-columns'
import { ApiList } from '@/components/api-list'

interface ProductClientProps {
  data: ProductColumn[]
}

export const ProductClient = ({ data }: ProductClientProps) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data?.length})`}
          description="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <PlusIcon className="mr-2 size-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API Calls for Products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  )
}
