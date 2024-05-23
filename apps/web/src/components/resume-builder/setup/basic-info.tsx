'use client'

import { updateProfile } from '@/actions/profile/setup';
import { useToast } from '@/components/toast/use-toast';
import { type Profile } from 'lib/types';
import { useForm } from 'react-hook-form';
import { useSetupContext } from 'src/hooks/useSetupContext';
import { Button, Input, Textarea } from 'ui';
import { StepContainer } from './components/container';

export function BasicInformation({ profile }: { profile: Profile }) {
    const { next, user } = useSetupContext()
    const { toast } = useToast()
    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<Profile>({
        defaultValues: {
            professional_summary: profile.professional_summary ?? '',
            full_name: profile.full_name,
            title: profile.title,
            location: profile.location
        }
    });

    // TODO: add validation
    const onSubmit = async (profile: Profile) => {
        if (!user) return;

        try {
            const { success } = await updateProfile({ profile, userId: user.id })
            if (!success) throw new Error();
            next();
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    return (
        <StepContainer
            title="Basic Information"
            description="Provide your full name, professional title, and a brief overview of your personal profile. This section is your first impression, so make it count." data-testid="basic-information"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <section className="grid grid-cols-2 gap-4 p-4 border bg-white mb-8">
                    <Input
                        autoFocus
                        data-testid="fullname"
                        label="Fullname"
                        hint={<p className="text-destructive">{errors.full_name?.message}</p>}
                        placeholder="fullname"
                        {...register('full_name', { required: { message: 'Name is required', value: true } })}
                    />
                    <Input
                        data-testid="title"
                        label="Title"
                        placeholder="Title"
                        {...register('title')}
                    />
                    <Textarea
                        data-testid="summary"
                        rows={5}
                        label="Professional summary"
                        placeholder="Professional Summary"
                        containerClasses="col-span-2"
                        {...register('professional_summary')}
                    />
                    <Input
                        data-testid="location"
                        label="Location"
                        placeholder="Location"
                        {...register('location')}
                    />
                </section>
                <Button loading={isSubmitting}>Save & Proceed</Button>
            </form>
        </StepContainer>
    )
}