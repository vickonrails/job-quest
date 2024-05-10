'use client'
import { CheckCircle } from 'lucide-react'
import { Controller, type UseFormReturn, useForm } from 'react-hook-form'
import { Button, Select, Textarea, type SelectOption } from 'ui'
import { Checkbox } from './checkbox'
import { Popover } from './popover'
import { useToast } from './toast/use-toast'
import { type FeedbackFormValues, createFeedback } from '@/utils/create-feedback'

const feedbackOptions: SelectOption[] = [
    { label: 'Feature request', value: 'feature' },
    { label: 'Bug report', value: 'bug' },
    { label: 'Improvement', value: 'improvement' },
]

// TODO: use server actions
export function FeedbackButton() {
    const form = useForm<FeedbackFormValues>({
        defaultValues: { content: '', reason: null, mailMe: false }
    })
    const { formState, reset } = form

    const handleOnInteractOutside = () => {
        const hasErrors = Object.keys(formState.errors).length > 0
        if (formState.submitCount > 0 && !hasErrors) {
            reset();
        }
    }

    const submitSuccessful = formState.isSubmitted && !formState.errors.root
    return (
        <Popover
            contentProps={{
                onFocusOutside: ev => ev.preventDefault(),
                onInteractOutside: handleOnInteractOutside
            }}
            Trigger={
                <button className="text-sm flex px-2 py-1 border items-center rounded-sm gap-2">
                    Feedback
                </button>
            }
        >
            {submitSuccessful ? (
                <section className="flex gap-2 flex-col items-center py-4">
                    <h2 className="text-muted-foreground text-sm">Feedback sent</h2>
                    <CheckCircle className="text-success" />
                </section>
            ) : <FeedbackForm form={form} />}
        </Popover>
    )
}

/**
 * Feedback form component
 */
function FeedbackForm({ form }: { form: UseFormReturn<FeedbackFormValues> }) {
    const { handleSubmit, control, register, formState, setError, reset } = form
    const { toast } = useToast()

    const handleFeedbackSend = async (feedbackData: FeedbackFormValues) => {
        setError('root', {})
        try {
            const response = await createFeedback(feedbackData)
            if (!response.success) {
                throw response.error
            }
            reset({ content: '', mailMe: false, reason: null });
        } catch {
            setError('root', { message: 'An error occurred' })
            toast({
                variant: 'destructive',
                title: 'An error occurred'
            })
        }
    }
    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(handleFeedbackSend)}>
            <Controller
                name="reason"
                control={control}
                render={({ field }) => (
                    <Select
                        value={field.value ?? undefined}
                        onValueChange={(val) => { field.onChange(val) }}
                        options={feedbackOptions}
                    />
                )}
            />
            <Textarea rows={5} {...register('content', { required: true })} />
            <Controller
                name="mailMe"
                control={control}
                render={({ field: item }) => (
                    <Checkbox
                        label="You can send me a follow-up mail"
                        checked={item.value ?? false}
                        onCheckedChange={val => item.onChange(val)}
                    />
                )}
            />
            <Button type="submit" disabled={!formState.isValid} loading={formState.isSubmitting}>Send</Button>
        </form>
    )
}