'use client'

import { Chip } from '@/components/chip';
import { useToast } from '@/components/toast/use-toast';
import { updateProfile } from '@/db/api/actions/profile.action';
import { type Profile } from 'lib/types';
import { createRef, useEffect, useState } from 'react';
import { useFieldArray, useForm, type UseFormReturn } from 'react-hook-form';
import { Button } from 'ui/button';
import { Input } from 'ui/input';

export default function ProfileSkills({ profile }: { profile: Profile }) {
    const form = useForm<Profile>({ defaultValues: { skills: profile.skills ?? [] } })
    const formRef = createRef<HTMLFormElement>()
    const { toast } = useToast()

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


    const onSubmit = async () => {
        const skills = form.getValues('skills');
        try {
            const newProfile: Profile = { ...profile, skills }
            const { success, error } = await updateProfile({ profile: newProfile })
            if (!success) throw new Error(error)
            toast({
                title: 'Profile updated successfully',
                variant: 'success'
            })
        } catch (error) {
            toast({
                title: 'An error occured',
                variant: 'destructive'
            })
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>
            <section className="p-4 border mb-8">
                <SkillsForm form={form} />
            </section>
            <Button type="submit" loading={form.formState.isSubmitting}>Save & Proceed</Button>
        </form>
    )
}

function SkillsForm({ form }: { form: UseFormReturn<Profile> }) {
    const [skillValue, setSkillValue] = useState<string>('')
    const inputRef = createRef<HTMLInputElement>()

    const { append, fields, remove } = useFieldArray({
        name: 'skills',
        control: form.control,
        keyName: '_id'
    });

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

    return (
        <section className="mb-4 rounded-md">
            <Input
                label="Relevant Skills (Press Enter to add)"
                className="mb-4"
                autoFocus
                value={skillValue}
                onChange={ev => setSkillValue(ev.target.value)}
                placeholder="Press Enter to add skill"
                ref={inputRef}
            />
            {fields.map((field, idx) => (
                <Chip key={field._id} label={field.label ?? ''} onCloseClick={() => remove(idx)} />
            ))}
        </section>
    )
}