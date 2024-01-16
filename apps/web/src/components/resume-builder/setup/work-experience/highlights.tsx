import { Textarea } from '@components/textarea';
import { forwardRef, useImperativeHandle } from 'react';
import { useFieldArray, useFormContext, type UseFieldArrayAppend } from 'react-hook-form';
import { type FormFields } from 'src/pages/profile/setup';

export interface RefTypeWorkExperience {
    append: UseFieldArrayAppend<FormFields, `workExperience.${number}.highlights`>
}

export interface HighlightPropTypes {
    index: number
}

export const Highlights = forwardRef<RefTypeWorkExperience, HighlightPropTypes>(({ index }, ref) => {
    const { control } = useFormContext<FormFields>();
    const { append, fields, remove } = useFieldArray({
        name: `workExperience.${index}.highlights`,
        control
    });

    useImperativeHandle(ref, () => {
        return {
            append
        }
    }, [append])

    return (
        <section className="col-span-2">
            {fields.map((field, idx) => {
                const isFirst = idx === 0
                // const formProps = register(`workExperience.${index}.highlights.${idx}.text`)
                return (
                    <section className="mb-2 flex flex-col items-end" key={field.id}>
                        <Textarea label={isFirst ? 'Highlights' : ''} containerClasses="col-span-2 col-start-0 w-full mb-1" rows={1} />
                        <button onClick={() => remove(idx)} className="text-sm hover:underline">Remove</button>
                    </section>
                )
            })}
        </section>
    )
})

Highlights.displayName = 'Highlights'