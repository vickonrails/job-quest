import React, { type ReactNode, type FC } from 'react'
import { Root, Portal, Overlay, Content, Cancel, Action, type DialogProps, Title, Description } from '@radix-ui/react-alert-dialog'
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
                <Content className="modal-content">
                    <Typography variant="display-sm-bold">{title}</Typography>
                    <Description>{description}</Description>
                    <div className="flex justify-end gap-2">
                        <Button fillType="outlined" size="sm" onClick={onCancel}>Cancel</Button>
                        <Button onClick={onOk} loading={isProcessing} size="sm">Ok</Button>
                    </div>
                </Content>
            </Portal>
        </Root>
    )
}
