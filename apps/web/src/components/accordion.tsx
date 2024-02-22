import React from 'react'
import * as RadixAccordion from '@radix-ui/react-accordion'

const Root = RadixAccordion.Root
const Item = RadixAccordion.Item
const Header = RadixAccordion.Header
const Content = RadixAccordion.Content
const Trigger = RadixAccordion.Trigger

type AccordionItemProps = RadixAccordion.AccordionItemProps & {
    header: React.ReactNode
    children: React.ReactNode
}

export function AccordionItem({ header, children, ...rest }: AccordionItemProps) {
    return (
        <Item {...rest}>
            <Header>
                <Trigger className="w-full text-base text-left accordion">{header}</Trigger>
            </Header>
            <Content>
                {children}
            </Content>
        </Item>
    )
}

export function Accordion({ children, ...rest }: RadixAccordion.AccordionMultipleProps | RadixAccordion.AccordionSingleProps) {
    return (
        <Root {...rest}>
            {children}
        </Root>
    )
}