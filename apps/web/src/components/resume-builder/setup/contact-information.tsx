import { useToast } from '@components/toast/use-toast'
import { type Database } from '@lib/database.types'
import { type Profile } from '@lib/types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Button, Input } from 'ui'
import { StepContainer } from './container'

export default function ContactInformation({ profile }: { profile: Profile }) {
    const { register, handleSubmit, formState } = useForm({ defaultValues: profile })
    const client = useSupabaseClient<Database>();
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
            await updateProfile.mutateAsync(val)
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'An error occurred',
            })
        }
    }

    return (
        <StepContainer title="Contact Information">
            <p className="mb-4 text-gray-500">Make it easy for employers to reach you by providing your up-to-date contact details, including your phone number, email address, and professional networking profile links.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <section className="p-4 border bg-white mb-8">
                    <section className="mb-4 grid grid-cols-2 gap-3 rounded-md">
                        <Input
                            type="email"
                            autoFocus
                            label="Email Address"
                            placeholder="yourname@gmail.com"
                            {...register('email_address')}
                        />
                        <Input
                            label="LinkedIn URL"
                            placeholder="in/yourname"
                            {...register('linkedin_url')}
                        />
                        <Input
                            label="Personal Website"
                            placeholder="www.yourname.com"
                            {...register('personal_website')}
                        />
                        <Input
                            label="Github URL"
                            placeholder="www.github.com/yourname"
                            {...register('github_url')}
                        />
                    </section>
                </section>

                <Button loading={formState.isSubmitting}>Save</Button>
            </form>
        </StepContainer>
    )
}