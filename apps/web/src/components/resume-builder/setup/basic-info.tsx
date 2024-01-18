import { Textarea } from '@components/textarea';
import { type Database } from '@lib/database.types';
import { type Profile } from '@lib/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSetupContext } from 'src/hooks/useSetupContext';
import { Button, Input } from 'ui';
import { StepContainer } from './container';
import { useToast } from '@components/toast/use-toast';

export function BasicInformation({ profile }: { profile: Profile }) {
    const { next, session } = useSetupContext()
    const client = useSupabaseClient<Database>()
    const { toast } = useToast()
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<Profile>({
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
            await next();
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    return (
        <StepContainer title="Basic Information">
            <p className="mb-4 text-gray-500">Enter relevant basic information. These are mostly contact information.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <section className="grid grid-cols-2 mb-4 gap-4">
                    <Input label="Fullname" placeholder="fullname" {...register('full_name', { required: { message: 'It is required', value: true } })} />
                    <Input label="Title" placeholder="Title" {...register('title')} />
                    <Textarea rows={5} label="Professional summary" placeholder="Professional Summary" {...register('professional_summary')} containerClasses="col-span-2" />
                    <Input label="Location" placeholder="Location" {...register('location')} />
                </section>
                <Button loading={isSubmitting}>Save & Proceed</Button>
            </form>
        </StepContainer>
    )
}