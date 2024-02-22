'use client'

import { useState } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import type { Store } from '@/db/schema'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { useModalStore } from '@/hooks/use-modal-store'
import {
  Store as StoreIcon,
  Check,
  PlusCircle,
  ChevronsUpDown,
} from 'lucide-react'
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
  const pathname = usePathname()

  const { onOpen } = useModalStore()

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }))

  const currentStore = formattedItems.find(
    (item) => item.value === params.storeId
  )

  const isOnSettingsPage = pathname.endsWith('/settings')

  function onStoreSelect(store: typeof currentStore) {
    setOpen(false)
    if (isOnSettingsPage) {
      router.push(`/${store?.value}/settings`)
    } else {
      router.push(`/${store?.value}`)
    }
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
          <StoreIcon className="mr-2 size-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
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
                  <StoreIcon className="mr-2 size-4" />
                  {store.label}
                  <Check
                    className={cn(
                      'ml-auto size-4',
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
                <PlusCircle className="mr-2 size-5 cursor-pointer" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
