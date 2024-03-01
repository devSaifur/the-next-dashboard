'use client'

import { useState } from 'react'
import { MoreHorizontal, Edit, Copy, Trash } from 'lucide-react'
import { toast } from 'sonner'
import axios, { isAxiosError } from 'axios'
import { useMutation } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'

import { ColorColumn } from '@/components/colors/color-columns'
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/modals/alert-modals'

interface CellActionProps {
  data: ColorColumn
}

export const CellAction = ({ data }: CellActionProps) => {
  const [open, setOpen] = useState(false)

  const router = useRouter()
  const params = useParams()

  const storeId = params.storeId as string
  const colorId = data.id

  const { mutate: deleteColor, isPending: isDeleting } = useMutation({
    mutationKey: ['colors'],
    mutationFn: async () =>
      await axios.delete(`/api/${storeId}/colors/${colorId}`),
    onSuccess: () => {
      setOpen(false)
      toast.success('Color deleted successfully')
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

  function onCopy(id: string) {
    navigator.clipboard.writeText(id)
    toast.success('Color id copied to the clipboard')
  }

  function onUpdate() {
    router.push(`/${storeId}/colors/${colorId}`)
  }

  function onDelete() {
    deleteColor()
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
