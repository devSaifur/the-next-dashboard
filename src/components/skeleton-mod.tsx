import { Heading } from './ui/heading'
import { Skeleton } from './ui/skeleton'

interface SkeletonModProps {
  tile: string
  description: string
}

export default function SkeletonMod({ tile, description }: SkeletonModProps) {
  return (
    <div className="flex flex-col space-y-4">
      <Heading title={tile} description={description} />
      <div className="flex gap-x-4 *:h-7 *:w-[450px]">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
      <div className="flex gap-x-4 *:h-7 *:w-[450px]">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
      <div className="flex gap-x-4 *:h-7 *:w-[450px]">
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </div>
    </div>
  )
}
