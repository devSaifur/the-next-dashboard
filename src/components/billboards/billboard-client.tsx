'use client'

import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { useParams, useRouter } from 'next/navigation'
import { BillboardColumn } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { columns } from '@/components/billboards/columns'
import { ApiList } from '@/components/api-list'

interface BillboardClientProps {
  data: BillboardColumn[]
}

export const BillboardClient = ({ data }: BillboardClientProps) => {
  const router = useRouter()
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards (${data?.length})`}
          description="Manage billboards for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <PlusIcon className="mr-2 size-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />

      <Heading title="API" description="API Calls for Billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  )
}
