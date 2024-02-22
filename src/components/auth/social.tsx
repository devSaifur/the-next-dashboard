import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export const Social = () => {
  const isLoading = false

  return (
    <div className="mx-auto flex items-center">
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{' '}
        Google
      </Button>
      <p>or</p>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.facebook className="mr-2 h-4 w-4" />
        )}{' '}
        Facebook
      </Button>
    </div>
  )
}
