import React, { type ReactNode, type FC } from 'react'
import { Root, Portal, Overlay, Content, type DialogProps, Description } from '@radix-ui/react-alert-dialog'
import { Typography, Button } from 'ui'

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
                <Content className="modal-content rounded-md">
                    <Typography variant="display-sm-md" className="px-4 py-3">{title}</Typography>
                    <hr />
                    <div className="p-4 text-light-text">
                        <Description>{description}</Description>
                        <div className="flex justify-end gap-2">
                            <Button fillType="outlined" size="sm" onClick={onCancel}>Cancel</Button>
                            <Button onClick={onOk} loading={isProcessing} size="sm">Ok</Button>
                        </div>
                    </div>
                </Content>
            </Portal>
        </Root>
    )
}
