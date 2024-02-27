'use client'

import { useEffect, useState } from 'react'
import { StoreModal } from '@/components/modals/modal-store'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  // if not mounted return null to avoid hydration error on sever component
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <StoreModal />
    </>
  )
}
