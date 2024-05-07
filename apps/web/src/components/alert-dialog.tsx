import { Typography } from '@components/typography'
import { Content, Description, Overlay, Portal, Root, type DialogProps } from '@radix-ui/react-alert-dialog'
import { type FC, type ReactNode } from 'react'
import { Button } from 'ui'

interface AlertDialogProps extends DialogProps {
    title: string | ReactNode
    description?: string | ReactNode
    onOk?: () => void
    onCancel?: () => void
    isProcessing?: boolean
}

export const AlertDialog: FC<AlertDialogProps> = ({ open, description, title, onOk, onCancel, isProcessing, ...rest }) => {

    return (
        <Root open={open} {...rest}>
            <Portal>
                <Overlay className="fixed bg-black opacity-20 inset-0" />
                <Content className="bg-white w-full h-auto max-w-[500px] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] fixed rounded-md box-content flex flex-col">
                    <Typography variant="display-sm-md" className="px-4 py-3">{title}</Typography>
                    <hr />
                    <div className="p-4 text-light-text">
                        <Description className="text-sm mb-4">{description}</Description>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={onCancel}>Cancel</Button>
                            <Button variant="destructive" onClick={onOk} loading={isProcessing}>Delete</Button>
                        </div>
                    </div>
                </Content>
            </Portal>
        </Root>
    )
}
