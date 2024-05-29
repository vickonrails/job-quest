'use client'

import { type FeedbackFormValues } from '@/utils/create-feedback'
import { CheckCircle } from 'lucide-react'
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
                <Button variant="secondary" size="sm">Feedback</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80"
                onFocusOutside={ev => ev.preventDefault()}
                onInteractOutside={handleInteractOutside}
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
