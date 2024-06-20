'use client'

import { useToast } from '@/components/toast/use-toast'
import { updateProfile } from '@/db/api/actions/profile.action'
import { type Profile } from 'lib/types'
import { useForm } from 'react-hook-form'
import { Button } from 'ui/button'
import { Input } from 'ui/input'
import { ErrorHint } from './components/error-hint'

export default function ProfileContactInformation({ profile }: { profile: Profile }) {
    const { register, handleSubmit, formState } = useForm({ defaultValues: profile })
    const { toast } = useToast()

    const onSubmit = async (values: Profile) => {
        try {
            if (!profile.id) return
            const newProfile: Profile = { ...profile, ...values, is_profile_setup: true }
            const { success } = await updateProfile({ profile: newProfile })
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
    )
}