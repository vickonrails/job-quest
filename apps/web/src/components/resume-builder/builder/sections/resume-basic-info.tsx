
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { type SupabaseClient } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Resume } from 'lib/types';
import { useCallback, useRef } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { type Database } from 'shared';
import { Input, } from 'ui/input';
import { Textarea } from 'ui/textarea';
import useDeepCompareEffect from 'use-deep-compare-effect';

async function updateResumeQuery(resume: Resume, client: SupabaseClient<Database>) {
    return client.from('resumes').upsert(resume).select();
}

/**
 * Basic Information section in resume builder
*/
type BasicInfoForm = { form: UseFormReturn<{ 'resume': Resume }> }
export function BasicInfoSection({ form }: BasicInfoForm) {
    const { formState: { errors }, register } = form;
    const client = createClient()
    const queryClient = useQueryClient()
    const formRef = useRef<HTMLFormElement | null>(null);

    // TODO: error handling
    const updateMutation = useMutation({
        mutationFn: async (resume: Resume) => {
            const { data } = await updateResumeQuery(resume, client)
            return data
        },
        onSuccess: (data) => {
            if (!data) return;
            queryClient.setQueryData([`resume_${data[0]?.id}`, 'basic_info'], () => data[0])
        }
    })

    const saveFn = useCallback(async ({ resume }: { resume: Resume }) => {
        resume.id = resume.id ?? '';
        await updateMutation.mutateAsync(resume)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const watchedData = useWatch({
        control: form.control,
        defaultValue: form.getValues('resume'),
        name: 'resume'
    });

    const debounced = debounce(async () => { await form.handleSubmit(saveFn)() }, 1000)
    const debouncedSubmit = useCallback(debounced, [form.handleSubmit, saveFn])

    useDeepCompareEffect(() => {
        if (form.formState.isDirty) {
            debouncedSubmit().then(() => {/** */ })
        }
    }, [watchedData, debouncedSubmit])

    return (
        <form onSubmit={form.handleSubmit(saveFn)} ref={formRef}>
            <header>
                <h3 className="font-medium text-lg">Personal Information</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                    Provide your full name, professional title, and a brief overview of your personal profile. This section is your first impression, so make it count.
                </p>
            </header>

            <section className="grid grid-cols-2 gap-4 mb-8">
                <Input
                    autoFocus
                    data-testid="fullname"
                    label="Fullname"
                    hint={<p className="text-destructive">{errors.resume?.full_name?.message}</p>}
                    placeholder="fullname"
                    {...register('resume.full_name', { required: { message: 'Name is required', value: true } })}
                />
                <Input
                    data-testid="title"
                    label="Title"
                    placeholder="Title"
                    {...register('resume.title')}
                />
                <Textarea
                    data-testid="summary"
                    rows={5}
                    label="Professional summary"
                    placeholder="Professional Summary"
                    containerProps={{
                        className: 'col-span-2'
                    }}
                    {...register('resume.professional_summary')}
                />
                <Input
                    data-testid="location"
                    label="Location"
                    placeholder="Location"
                    {...register('resume.location')}
                />
            </section>
        </form>
    )
}
