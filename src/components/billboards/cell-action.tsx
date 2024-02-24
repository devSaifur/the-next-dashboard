'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Copy, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

import type { BillboardColumn } from '@/components/billboards/columns'
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/modals/alert-modals'
import { deleteBillboardAction } from '@/actions/billboard-delete'

interface CellActionProps {
  data: BillboardColumn
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const params = useParams()

  const storeId = params.storeId as string
  const billboardId = data.id

  const { mutate: deleteBillboard, isPending: isDeleting } = useMutation({
    mutationKey: ['billboards'],
    mutationFn: deleteBillboardAction,
    onSuccess: ({ error, success }) => {
      if (error) toast.error(error)
      if (success) {
        toast.success(success)
        router.refresh()
      }
    },
  })

  function onCopy(id: string) {
    navigator.clipboard.writeText(id)
    toast.success('Billboard id copied to the clipboard')
  }

  function onUpdate() {
    router.push(`/${params.storeId}/billboards/${data.id}`)
  }

  function onDelete() {
    deleteBillboard({ storeId, billboardId })
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isDeleting}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onCopy(data.id)}
            className="cursor-pointer"
          >
            <Copy className="mr-2 size-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUpdate} className="cursor-pointer">
            <Edit className="mr-2 size-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpen(true)}
            className="cursor-pointer"
          >
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
