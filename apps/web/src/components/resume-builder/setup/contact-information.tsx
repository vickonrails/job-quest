import { useToast } from '@components/toast/use-toast'
import { createClient } from '@lib/supabase/component'
import { type Profile } from '@lib/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Button, Input } from 'ui'
import { StepContainer } from './components/container'
import { ErrorHint } from './components/error-hint'

export default function ContactInformation({ profile }: { profile: Profile }) {
    const { register, handleSubmit, formState } = useForm({ defaultValues: profile })
    const client = createClient();
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const updateProfile = useMutation({
        mutationFn: async (values: Profile) => {
            return client.from('profiles').update(values).eq('id', profile.id)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profile'] })
        },
    })

    const onSubmit = async (val: Profile) => {
        try {
            await updateProfile.mutateAsync({ ...val, is_profile_setup: true })
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'An error occurred',
            })
        }
    }

    return (
        <StepContainer
            data-testid="contact-information"
            title="Contact Information"
            description="Make it easy for employers to reach you by providing your up-to-date contact details, including your phone number, email address, and professional networking profile links."
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <section className="p-4 border bg-white mb-8">
                    <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                        <Input
                            autoFocus
                            data-testid="email-address"
                            type="email"
                            label="Email Address"
                            placeholder="yourname@gmail.com"
                            hint={<ErrorHint>{formState.errors.email_address?.message}</ErrorHint>}
                            {...register('email_address', { required: { message: 'Email address is required', value: true } })}
                        />
                        <Input
                            type="url"
                            data-testid="linkedin-url"
                            label="LinkedIn URL"
                            placeholder="in/yourname"
                            {...register('linkedin_url')}
                        />
                        <Input
                            type="url"
                            data-testid="personal-website"
                            label="Personal Website"
                            placeholder="www.yourname.com"
                            {...register('personal_website')}
                        />
                        <Input
                            type="url"
                            data-testid="github-url"
                            label="Github URL"
                            placeholder="www.github.com/yourname"
                            {...register('github_url')}
                        />
                    </section>
                </section>

                <Button loading={formState.isSubmitting}>Complete Profile Setup</Button>
            </form>
        </StepContainer>
    )
}