import { Textarea } from '@components/textarea';
import { useFormContext } from 'react-hook-form';
import { useSetupContext } from 'src/hooks/useSetupContext';
import { type FormFields } from 'src/pages/profile/setup';
import { Button, Input } from 'ui';
import { StepContainer } from './container';

export function BasicInformation() {
    const { register, handleSubmit, formState: { isSubmitting } } = useFormContext<FormFields>();
    const { next, updateBasicInfo, session } = useSetupContext()

    // TODO: add validation
    const onSubmit = async ({ full_name, location, title, professional_summary }: FormFields) => {
        if (!session) return;
        // TODO: error handling
        await updateBasicInfo({ full_name, location, title, professional_summary }, session?.user?.id);
        next();
    }

    return (
        <StepContainer title="Basic Information">
            <p className="mb-4 text-gray-500">Enter relevant basic information. These are mostly contact information.</p>
            <form onSubmit={handleSubmit(onSubmit)}>
                <section className="grid grid-cols-2 mb-4 gap-4">
                    <Input label="Fullname" placeholder="fullname" {...register('full_name')} />
                    <Input label="Title" placeholder="Title" {...register('title')} />
                    <Textarea rows={5} label="Professional summary" placeholder="Professional Summary" {...register('professional_summary')} containerClasses="col-span-2" />
                    <Input label="Location" placeholder="Location" {...register('location')} />
                </section>
                <Button loading={isSubmitting}>Proceed</Button>
            </form>
        </StepContainer>
    )
}