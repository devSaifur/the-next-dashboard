import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

interface FormActionErrorProps {
  message: string
}

export const FormActionError = ({ message }: FormActionErrorProps) => {
  if (!message) return null

  return (
    <div className="flex items-center gap-x-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
      <ExclamationTriangleIcon className="size-4" />
      <p>{message}</p>
    </div>
  )
}
