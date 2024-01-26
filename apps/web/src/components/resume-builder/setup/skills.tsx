import { Chip } from '@components/chips';
import { type Database } from '@lib/database.types';
import { type Profile } from '@lib/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation } from '@tanstack/react-query';
import { createRef, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useSetupContext } from 'src/hooks/useSetupContext';
import { Button, Input } from 'ui';
import { StepContainer } from './container';
import { useToast } from '@components/toast/use-toast';

export default function Skills({ profile }: { profile: Profile }) {
    const client = useSupabaseClient<Database>()
    const { session, next } = useSetupContext()
    const form = useForm<Profile>({ defaultValues: { skills: profile.skills ?? [] } })
    const [skillValue, setSkillValue] = useState<string>()
    const inputRef = createRef<HTMLInputElement>()
    const formRef = createRef<HTMLFormElement>()
    const { toast } = useToast()

    const { fields, remove, append } = useFieldArray({
        name: 'skills',
        control: form.control,
        keyName: '_id'
    });

    const handleSkillsUpdate = useMutation({
        mutationFn: async (skills: Pick<Profile, 'skills'>) => {
            if (!session) return
            const { data, error } = await client.from('profiles').update(skills).eq('id', session.user.id).select('*');
            if (error) throw error;
            return data;
        }
    })

    useEffect(() => {
        const form = formRef.current;
        const handler = (ev: KeyboardEvent) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                return;
            }
        }

        form?.addEventListener('keypress', handler);
        return () => {
            form?.removeEventListener('keypress', handler)
        }
    }, [formRef])

    useEffect(() => {
        const input = inputRef.current;
        const handler = (ev: KeyboardEvent) => {
            if (!skillValue) return
            if (ev.key === 'Enter') {
                append({ label: skillValue })
                setSkillValue('')
            }
        }
        input?.addEventListener('keypress', handler);
        return () => {
            input?.removeEventListener('keypress', handler);
        }
    }, [append, inputRef, skillValue])

    const onSubmit = async () => {
        const values = form.getValues('skills');
        try {
            await handleSkillsUpdate.mutateAsync({ skills: values })
            next()
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    return (
        <StepContainer title="Skills">
            <p className="mb-4 text-gray-500">Highlight the skills that set you apart, including technical and soft skills. Focus on those that are most relevant to the job you want.</p>
            <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
                <section className="p-4 border bg-white mb-8">
                    <section className="mb-4 rounded-md">
                        <Input
                            label="Relevant Skills (Press Enter to add)"
                            className="mb-4"
                            value={skillValue}
                            onChange={ev => setSkillValue(ev.target.value)}
                            placeholder="Press Enter to add skill"
                            ref={inputRef}
                        />
                        {fields.map((field, idx) => (
                            <Chip key={field._id} label={field.label} onCloseClick={() => remove(idx)} />
                        ))}
                    </section>
                </section>
                <Button type="submit" loading={form.formState.isSubmitting}>Save & Proceed</Button>
            </form>
        </StepContainer>
    )
}
