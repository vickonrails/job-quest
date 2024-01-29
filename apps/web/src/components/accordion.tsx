import React from 'react'
import * as RadixAccordion from '@radix-ui/react-accordion'

const Root = RadixAccordion.Root
const Item = RadixAccordion.Item
const Header = RadixAccordion.Header
const Content = RadixAccordion.Content
const Trigger = RadixAccordion.Trigger

interface AccordionProps {
    header: React.ReactNode
    children?: React.ReactNode
}

// TODO: animating the accordion
export function Accordion(props: AccordionProps) {
    return (
        <Root collapsible type="single">
            <Item value="item-1">
                <Header>
                    <Trigger className="w-full text-base text-left accordion">{props.header}</Trigger>
                </Header>
                <Content>
                    {props.children}
                </Content>
            </Item>
        </Root>
    )
}