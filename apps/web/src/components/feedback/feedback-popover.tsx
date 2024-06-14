'use client'

import { type FeedbackFormValues } from '@/utils/create-feedback'
import { CheckCircle, MessageSquarePlus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Button } from 'ui/button'
import { Popover, PopoverContent, PopoverTrigger } from 'ui/popover'
import { FeedbackForm } from './feedback-form'

export function Feedback() {
    const form = useForm<FeedbackFormValues>({
        defaultValues: { content: '', reason: null, mailMe: false }
    })
    const { formState, reset } = form
    const submitSuccessful = formState.isSubmitted && !formState.errors.root

    const handleInteractOutside = () => {
        const hasErrors = Object.keys(formState.errors).length > 0
        if (formState.submitCount > 0 && !hasErrors) {
            reset();
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className="w-full justify-start rounded-md text-muted-foreground hover:text-muted-foreground"
                    variant="ghost" size="sm"
                >
                    <MessageSquarePlus className="mr-2" />
                    <span>Feedback</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80"
                onFocusOutside={ev => ev.preventDefault()}
                onInteractOutside={handleInteractOutside}
                side="top"
                align="start"
            >
                {submitSuccessful ? (
                    <section className="flex gap-2 flex-col items-center py-4">
                        <h2 className="text-muted-foreground text-sm">Feedback sent</h2>
                        <CheckCircle className="text-success" />
                    </section>
                ) : <FeedbackForm form={form} />}
            </PopoverContent>
        </Popover>
    )
}
