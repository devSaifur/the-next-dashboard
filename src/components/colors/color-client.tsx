'use client'

import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { ColorColumn, columns } from '@/components/colors/color-columns'
import { DataTable } from '@/components/ui/data-table'
import { ApiList } from '@/components/api-list'

interface ColorClientProps {
  data: ColorColumn[]
}

export const ColorClient = ({ data }: ColorClientProps) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data?.length})`}
          description="Manage Colors for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <PlusIcon className="mr-2 size-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API Calls for Colors" />
      <Separator />
      <ApiList entityName="Colors" entityIdName="colorId" />
    </>
  )
}
