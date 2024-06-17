'use client'

import { updateProfile } from '@/actions/profile/setup'
import { useToast } from '@/components/toast/use-toast'
import { type Profile } from 'lib/types'
import { useForm } from 'react-hook-form'
import { Input } from 'ui'
import { Button } from 'ui/button'
import { StepContainer } from './components/container'
import { ErrorHint } from './components/error-hint'

export default function ContactInformation({ profile }: { profile: Profile }) {
    const { register, handleSubmit, formState } = useForm({ defaultValues: profile })
    const { toast } = useToast()

    const onSubmit = async (values: Profile) => {
        try {
            if (!profile.id) return
            const newProfile: Profile = { ...profile, ...values, is_profile_setup: true }
            const { success } = await updateProfile({ profile: newProfile, userId: profile?.id })
            if (!success) throw new Error()
            toast({
                variant: 'success',
                title: 'Profile setup successfully',
            })
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
                <section className="p-4 border mb-8">
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