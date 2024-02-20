import { type Resume } from '@lib/types';
import { useFormContext } from 'react-hook-form';
import { Input, Textarea } from 'ui';

/**
 * Basic Information section in resume builder
 */
export function BasicInfoSection() {
    const form = useFormContext<{ resume: Resume }>();
    const { formState: { errors }, register } = form;

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
