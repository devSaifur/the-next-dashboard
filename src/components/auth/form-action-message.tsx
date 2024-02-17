import { cn } from '@/lib/utils'
import {
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from '@radix-ui/react-icons'

interface FormStateMessageProps {
  message: string
  type: 'error' | 'success'
}

export const FormStateMessage = ({ message, type }: FormStateMessageProps) => {
  if (!message) return null

  const isError = type === 'error'
  const isSuccess = type === 'success'

  return (
    <div
      className={cn(
        'flex items-center gap-x-2 rounded-md p-3 text-sm',
        {
          'bg-destructive/15 text-destructive': isError,
        },
        {
          'bg-emerald-500/15 text-emerald-500': isSuccess,
        }
      )}
    >
      {isError && <ExclamationTriangleIcon className="h-4 w-4" />}
      {isSuccess && <CheckCircledIcon className="h-4 w-4" />}
      <p>{message}</p>
    </div>
  )
}
