import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from './toast'
import { useToast } from './use-toast'
import { Check, AlertCircle, Info, AlertTriangle } from 'lucide-react'

type ToastVariants = { [key: string]: JSX.Element }
const TOAST_ICON_VARIANTS: ToastVariants = {
  'default': <Info />,
  'success': <SuccessIcon />,
  'destructive': <DestructiveIcon />,
  'warning': <WarningIcon />
}

function SuccessIcon() {
  return (
    <div className="bg-white rounded-full h-5 w-5 flex">
      <Check className="text-success m-auto stroke-2" size={16} />
    </div>
  )
}

function WarningIcon() {
  return (
    <AlertTriangle className="text-warning-foreground m-auto" size={16} />
  )
}

function DestructiveIcon() {
  return (
    <AlertCircle className="m-auto text-destructive-foreground h-6 w-6" />
  )
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <>
      {
        toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && (
                  <div className="flex items-center gap-3">
                    {TOAST_ICON_VARIANTS[props.variant ?? 'default']}
                    <ToastTitle className="flex-1">
                      {title}
                    </ToastTitle>
                  </div>
                )}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          )
        })
      }
      < ToastViewport />
    </>
  )
}
