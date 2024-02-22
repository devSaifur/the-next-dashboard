'use client'

import { PlusIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'

export const BillboardClient = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Billboards (0)"
          description="Manage billboards for your store"
        />
        <Button>
          <PlusIcon className="mr-2 size-4" /> Add New
        </Button>
      </div>
      <Separator />
    </>
  )
}
