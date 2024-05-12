
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { type Resume } from 'lib/types';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Input, Textarea } from 'ui';
import useDeepCompareEffect from 'use-deep-compare-effect';


/**
 * Basic Information section in resume builder
*/
export function BasicInfoSection() {
    const form = useFormContext<{ resume: Resume }>();
    const client = createClient();
    const router = useRouter();
    const { formState: { errors }, register } = form;

    const saveFn = useCallback(async ({ resume }: { resume: Resume }) => {
        // TODO: this needs to be fixed
        resume.id = resume.id ?? '';
        const { data, error } = await client.from('resumes').upsert(resume);
        if (error) throw error;
        return data;
    }, [router, client])

    const handleSubmit = useCallback(
        debounce(async () => {
            await form.handleSubmit(saveFn)()
        }, 1000),
        []
    )

    const watchedData = useWatch({
        control: form.control,
        name: 'resume',
        defaultValue: form.getValues('resume')
    });

    useDeepCompareEffect(() => {
        if (!form.getFieldState('resume').isDirty) return;
        handleSubmit().then(() => {
            // alert('Just saved the basic information area')
        }).catch(() => {
            // 
        });
    }, [watchedData])

    return (
        <section className="grid grid-cols-2 gap-4 bg-white mb-8">
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
                containerClasses="col-span-2"
                {...register('resume.professional_summary')}
            />
            <Input
                data-testid="location"
                label="Location"
                placeholder="Location"
                {...register('resume.location')}
            />
        </section>
    )
}
