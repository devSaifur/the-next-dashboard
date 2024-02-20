'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { Store } from '@/db/schema'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { useModalStore } from '@/hooks/use-modal-store'
import {
  LuStore,
  LuCheck,
  LuPlusCircle,
  LuChevronsUpDown,
} from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { PopoverContent } from '@radix-ui/react-popover'
import {
  Command,
  CommandGroup,
  CommandList,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command'

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Store[] | undefined
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const [open, setOpen] = useState(false)
  const params = useParams()
  const router = useRouter()

  const { onOpen } = useModalStore()

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  )

  function onStoreSelect(store: typeof currentStore) {
    setOpen(false)
    router.push(`/${store?.value}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn('w-[200px] justify-between', className)}
        >
          <LuStore className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <LuChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((store) => (
                <CommandItem
                  onSelect={() => onStoreSelect(store)}
                  className="text-sm"
                  key={store.value}
                >
                  <LuStore className="mr-2 h-4 w-4" />
                  {store.label}
                  <LuCheck
                    className={cn(
                      'ml-auto h-4 w-4',
                      currentStore?.value === store.value
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  onOpen()
                }}
              >
                <LuPlusCircle className="mr-2 h-5 w-5 cursor-pointer" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
