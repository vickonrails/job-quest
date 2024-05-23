import { Typography } from '@/components/typography'
import * as RdxDialog from '@radix-ui/react-dialog'
import { type ReactNode } from 'react'
import { cn } from 'shared'

export interface DialogProps extends RdxDialog.DialogProps {
    /**
     * title of the dialog
     */
    title: ReactNode
    /**
     * content props of the dialog
     */
    contentProps?: RdxDialog.DialogContentProps
}

export function Dialog({ children, title, contentProps, ...rest }: DialogProps) {
    const { className: contentClassName, ...restContentProps } = contentProps ?? {}
    return (
        <RdxDialog.Root {...rest}>
            <RdxDialog.Portal>
                <RdxDialog.Overlay className="fixed bg-black opacity-20 inset-0" />
                <RdxDialog.Content
                    className={cn('bg-white w-full max-w-[500px] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] fixed rounded-md box-content flex flex-col', contentClassName)}
                    {...restContentProps}
                >
                    <Typography variant="display-sm-md" className="px-4 py-3">{title}</Typography>
                    <hr />

                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </RdxDialog.Content>
            </RdxDialog.Portal>
        </RdxDialog.Root>
    )
}