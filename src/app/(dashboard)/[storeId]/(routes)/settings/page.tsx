import { SettingsForm } from '@/components/settings/settings-form'
import { getStoreById } from '@/data/store'
import { getUser } from '@/auth/getUser'
import { redirect } from 'next/navigation'

interface SettingsPageProps {
  params: { storeId: string }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { storeId } = params

  const user = await getUser()

  if (!user) redirect('/sign-in')

  const store = await getStoreById(storeId)

  if (!store) redirect('/')

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}
