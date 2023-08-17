import React, { type ReactNode } from 'react'
import { Root, Portal, Content, Overlay, type DialogProps as RdxDialogProps } from '@radix-ui/react-dialog'
import { Typography } from '@components/typography'

type DialogProps = {
    title: ReactNode | string
} & RdxDialogProps

export const Dialog = ({ children, title, ...rest }: DialogProps) => {
    return (
        <Root {...rest}>
            <Portal>
                <Overlay className="fixed bg-black opacity-20 inset-0" />
                <Content className="bg-white w-full max-w-[500px] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] fixed rounded-md box-content h-[90%] flex flex-col">
                    <Typography variant="display-sm-md" className="px-4 py-3">{title}</Typography>
                    <hr />

                    <div className="p-4 flex-1 overflow-y-auto">
                        {children}
                    </div>
                    <hr />

                    <div className="p-4">
                        Footer
                    </div>
                </Content>
            </Portal>
        </Root>
    )
}