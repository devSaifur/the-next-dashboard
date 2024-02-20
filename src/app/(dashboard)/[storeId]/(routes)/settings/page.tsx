import { SettingsForm } from '@/components/settings-form'
import { getStoreByUserId } from '@/data/store'
import { getUser } from '@/hooks/getUser'
import { redirect } from 'next/navigation'

interface SettingsPageProps {
  params: { storeId: string }
}

const SettingsPage = async ({ params }: SettingsPageProps) => {
  const { storeId } = params

  const user = await getUser()

  if (!user) redirect('/sign-in')

  const { userId } = user

  const store = await getStoreByUserId(userId)

  if (!store) redirect('/')

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} storeId={storeId} />
      </div>
    </div>
  )
}

export default SettingsPage
