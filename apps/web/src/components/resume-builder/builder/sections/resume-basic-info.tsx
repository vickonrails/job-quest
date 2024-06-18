
import { updateResume } from '@/db/actions/resume';
import { debounce } from '@/utils/debounce';
import { type Resume } from 'lib/types';
import { useCallback, useRef } from 'react';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import { Input, } from 'ui/input';
import { Textarea } from 'ui/textarea';
import useDeepCompareEffect from 'use-deep-compare-effect';

/**
 * Basic Information section in resume builder
*/
type BasicInfoForm = { form: UseFormReturn<{ 'resume': Resume }> }
export function BasicInfoSection({ form }: BasicInfoForm) {
    const { formState: { errors }, register } = form;
    const formRef = useRef<HTMLFormElement | null>(null);

    const saveFn = useCallback(async ({ resume }: { resume: Resume }) => {
        resume.id = resume.id ?? '';
        const { success, error } = await updateResume(resume)
        if (!success && error) {
            throw new Error(error)
        }
    }, [])

    const watchedData = useWatch({
        control: form.control,
        defaultValue: form.getValues('resume'),
        name: 'resume'
    });

    const debounced = debounce(async () => { await form.handleSubmit(saveFn)() }, 3000)
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
