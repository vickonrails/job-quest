import { createFeedback, type FeedbackFormValues } from '@/utils/create-feedback'
import { Controller, type UseFormReturn } from 'react-hook-form'
import { Select, type SelectOption } from 'ui'
import { Button } from 'ui/button'
import { Checkbox } from 'ui/checkbox'
import { Label } from 'ui/label'
import { Textarea } from 'ui/textarea'
import { useToast } from '../toast/use-toast'

const feedbackOptions: SelectOption[] = [
    { label: 'Feature request', value: 'feature' },
    { label: 'Bug report', value: 'bug' },
    { label: 'Improvement', value: 'improvement' },
]

/**
 * Feedback form component
 */
export function FeedbackForm({ form }: { form: UseFormReturn<FeedbackFormValues> }) {
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
        <form className="flex flex-col gap-3" data-testid="feedback-form" onSubmit={handleSubmit(handleFeedbackSend)}>
            <Controller
                name="reason"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                    <Select
                        value={field.value ?? undefined}
                        onValueChange={(val) => { field.onChange(val) }}
                        options={feedbackOptions}
                    />
                )}
            />
            <Textarea placeholder="Enter feedback here" rows={5} {...register('content', { required: true })} />
            <Controller
                name="mailMe"
                control={control}
                render={({ field: item }) => (
                    <div className="flex gap-2">
                        <Checkbox
                            id="mailMe"
                            checked={item.value ?? false}
                            onCheckedChange={val => item.onChange(val)}
                        />
                        <Label htmlFor="mailMe">You can send me a follow-up mail</Label>
                    </div>
                )}
            />
            <Button type="submit" disabled={!formState.isValid} loading={formState.isSubmitting}>Send</Button>
        </form>
    )
}