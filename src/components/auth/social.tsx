import { Icons } from '../icons'
import { Button } from '../ui/button'

export const Social = () => {
  const isLoading = false

  return (
    <div className="mx-auto flex items-center">
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{' '}
        Google
      </Button>
      <p>or</p>
      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.facebook className="mr-2 h-4 w-4" />
        )}{' '}
        Facebook
      </Button>
    </div>
  )
}
