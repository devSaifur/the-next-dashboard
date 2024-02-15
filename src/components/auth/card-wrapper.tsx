import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Social } from '@/components/auth/social'
import { BackButton } from '@/components/auth/back-button'

interface CardWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
  of: 'sign-in' | 'sign-up'
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
  of,
}: CardWrapperProps) => {
  return (
    <Card className="w-[350px] shadow-md">
      <CardHeader>
        <div className="flex w-full flex-col items-center justify-center gap-y-4">
          <h1 className="text-2xl font-semibold">
            {of === 'sign-in' ? 'Sign in to your account' : 'Create an account'}
          </h1>
          <p className="text-sm text-muted-foreground">{headerLabel}</p>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  )
}
