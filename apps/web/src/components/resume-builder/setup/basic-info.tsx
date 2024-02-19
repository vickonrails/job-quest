import { useToast } from '@components/toast/use-toast';
import { type Database } from '@lib/database.types';
import { type Profile } from '@lib/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSetupContext } from 'src/hooks/useSetupContext';
import { Button, Input, Textarea } from 'ui';
import { StepContainer } from './container';

export function BasicInformation({ profile }: { profile: Profile }) {
    const { next, session } = useSetupContext()
    const client = useSupabaseClient<Database>()
    const { toast } = useToast()
    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm<Profile>({
        defaultValues: {
            professional_summary: profile.professional_summary ?? '',
            full_name: profile.full_name,
            title: profile.title,
            location: profile.location
        }
    });

    const updateBasicInfo = useMutation({
        mutationFn: async ({ values, userId }: { values: Profile, userId: string }) => {
            const { error } = await client.from('profiles').update({ ...values, id: userId }).eq('id', userId);
            if (error) throw error;
        }
    })

    // TODO: add validation
    const onSubmit = async (values: Profile) => {
        if (!session) return;

        try {
            await updateBasicInfo.mutateAsync({ values, userId: session?.user?.id });
            next();
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    return (
        <StepContainer title="Basic Information" data-testid="basic-information">
            <p className="mb-4 text-gray-500">Provide your full name, professional title, and a brief overview of your personal profile. This section is your first impression, so make it count.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <section className="grid grid-cols-2 gap-4 p-4 border bg-white mb-8">
                    <Input
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