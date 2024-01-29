import { MenuBar, MenuItem } from '@components/menubar';
import { EducationForm } from '@components/resume-builder/setup/education/education-form-item';
import { formatDate } from '@components/utils';
import { type Database } from '@lib/database.types';
import { type Education } from '@lib/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AddSectionBtn } from '.';

/**
 * Education section in resume builder
 */
export function EducationSection({ session }: { session: Session }) {
    const form = useFormContext<{ education: Education[] }>();
    const client = useSupabaseClient<Database>();
    const { fields } = useFieldArray<{ education: Education[] }, 'education', '_id'>({ control: form.control, name: 'education', keyName: '_id' });
    const { data: educationTemplates } = useQuery({
        queryKey: ['educationTemplates'],
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('User not logged in');
            const { data, error } = await client.from('education').select().eq('user_id', session?.user?.id).filter('resume_id', 'is', null)
            if (error) throw error;
            return data;
        }
    })

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

            <MenuBar
                contentProps={{ side: 'bottom', align: 'start', className: 'min-w-72 shadow-sm' }}
                triggerProps={{ className: 'text-primary' }}
                trigger={(
                    <AddSectionBtn>
                        Add Education
                    </AddSectionBtn>
                )}
                onClick={e => e.stopPropagation()}
            >
                {educationTemplates?.map((education) => {
                    const { institution, field_of_study, id, start_date, end_date } = education
                    const endDate = end_date ? formatDate(end_date) : 'Now'
                    return (
                        <MenuItem className="py-2" key={id}>
                            <p className="font-medium">{institution} - {field_of_study}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(start_date)} - {endDate}</p>
                        </MenuItem>
                    )
                })}
            </MenuBar>
        </section>
    )

}