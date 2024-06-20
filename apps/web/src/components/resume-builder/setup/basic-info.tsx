'use client'

import { useToast } from '@/components/toast/use-toast';
import { updateProfile } from '@/db/api/actions/profile.action';
import { type Profile } from 'lib/types';
import { useForm } from 'react-hook-form';
import { Button } from 'ui/button';
import { Input } from 'ui/input';
import { Textarea } from 'ui/textarea';

export function BasicInformationForm({ profile }: { profile: Profile }) {
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
        try {
            const { success } = await updateProfile({ profile })
            if (!success) throw new Error();
            toast({
                title: 'Profile updated successfully',
                variant: 'success'
            })

            // TODO: navigate to next step
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <section className="grid grid-cols-2 gap-4 mb-4">
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
                    containerProps={{
                        className: 'col-span-2'
                    }}
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
    )
}