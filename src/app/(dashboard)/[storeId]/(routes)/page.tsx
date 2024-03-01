import { getStoreById } from '@/data/store'

interface DashboardPageProps {
  params: { storeId: string }
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const { storeId } = params
  const store = await getStoreById(storeId)

  return (
    <div>
      <p>Store name: {store?.name}</p>
    </div>
  )
}

export default DashboardPage
