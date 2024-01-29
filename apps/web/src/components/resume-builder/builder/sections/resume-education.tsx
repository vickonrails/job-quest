import { EducationForm } from '@components/resume-builder/setup/education/education-form-item';
import { type Education } from '@lib/types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AddSectionBtn } from '.';

/**
 * Education section in resume builder
 */
export function EducationSection() {
    const form = useFormContext<{ education: Education[] }>();
    const { fields } = useFieldArray<{ education: Education[] }, 'education', '_id'>({ control: form.control, name: 'education', keyName: '_id' });

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Education</h3>
            <p className="mb-4 text-sm text-muted-foreground">List your academic background, including degrees earned, institutions attended, and any honors or awards received. Relevant coursework can also be included here.</p>
            {fields.map((field, index) => (
                <EducationForm
                    field={field}
                    index={index}
                    form={form}
                    key={field._id}
                    onDeleteClick={() => {/** */ }}
                />
            ))}
            <AddSectionBtn>Add Education</AddSectionBtn>
        </section>
    )

}