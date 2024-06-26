import { SettingsForm } from '@/components/settings/settings-form'
import { getStoreById } from '@/data/store'
import { checkAuth } from '@/auth/utils'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import SkeletonMod from '@/components/skeleton-mod'

interface SettingsPageProps {
  params: { storeId: string }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  await checkAuth()

  const { storeId } = params

  const store = await getStoreById(storeId)

  if (!store) redirect('/')

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Suspense
          fallback={
            <SkeletonMod
              tile="Settings"
              description="Manage store preferences"
            />
          }
        >
          <SettingsForm initialData={store} />
        </Suspense>
      </div>
    </div>
  )
}
