import { Textarea } from '@components/textarea';
import { useFormContext } from 'react-hook-form';
import { type FormFields } from 'src/pages/profile/setup';
import { Input } from 'ui';
import { StepContainer } from './container';

export function BasicInformation() {
    const { register } = useFormContext<FormFields>();
    return (
        <StepContainer title="Basic Information">
            <p className="mb-4 text-gray-500">Basic Information.</p>
            <form className="mb-4 grid grid-cols-2 gap-4">
                <Input label="Fullname" placeholder="fullname" {...register('fullname')} />
                <Input label="Title" placeholder="Title" {...register('title')} />
                <Textarea rows={5} label="Professional summary" placeholder="Professional Summary" {...register('summary')} containerClasses="col-span-2" />
                <Input label="Location" placeholder="Location" {...register('location')} />
            </form>
        </StepContainer>
    )
}