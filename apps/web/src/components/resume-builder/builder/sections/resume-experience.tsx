import { MenuBar, MenuItem } from '@components/menubar';
import { WorkExperienceForm } from '@components/resume-builder/setup/work-experience/work-experience-form-item';
import { formatDate } from '@components/utils';
import { type Database } from '@lib/database.types';
import { type WorkExperience } from '@lib/types';
import { useSupabaseClient, type Session } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AddSectionBtn } from '.';

/**
 * Work Experience section in resume builder
 */
export function WorkExperienceSection({ session }: { session: Session }) {
    const client = useSupabaseClient<Database>()
    const form = useFormContext<{ workExperience: WorkExperience[] }>();
    const { fields } = useFieldArray<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>({ control: form.control, name: 'workExperience', keyName: '_id' });
    const { data: templateWorkExperience } = useQuery({
        queryKey: ['workExperienceTemplate'],
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('User not logged in');
            const { data, error } = await client.from('work_experience').select().eq('user_id', session?.user?.id).filter('resume_id', 'is', null)
            if (error) throw error;
            return data;
        }
    })

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Work Experience</h3>
            <p className="mb-4 text-sm text-muted-foreground">Detail your professional history, including past positions held, responsibilities, key achievements, and the skills you developed. Tailor this section to the job you&apos;re applying for.</p>
            {fields.map((field, index) => (
                <WorkExperienceForm
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
                        Add Experience
                    </AddSectionBtn>
                )}
                onClick={e => e.stopPropagation()}
            >
                {templateWorkExperience?.map((workExperience) => {
                    const { company_name, job_title, id, start_date, end_date } = workExperience
                    const endDate = end_date ? formatDate(end_date) : 'Now'
                    return (
                        <MenuItem className="py-2" key={id}>
                            <p className="font-medium">{job_title} - {company_name}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(start_date)} - {endDate}</p>
                        </MenuItem>
                    )
                }
                )}
            </MenuBar>

        </section>
    )
}