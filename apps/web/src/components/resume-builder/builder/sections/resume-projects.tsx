import { MenuBar, MenuItem } from '@components/menubar';
import { ProjectForm } from '@components/resume-builder/setup/projects/project-form-item';
import { formatDate } from '@components/utils';
import { type Database } from '@lib/database.types';
import { type Project } from '@lib/types';
import { useSupabaseClient, type Session } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AddSectionBtn } from '.';

/**
 * Projects section in resume builder
 */
export function ProjectsSection({ session }: { session: Session }) {
    const form = useFormContext<{ projects: Project[] }>();
    const client = useSupabaseClient<Database>();
    const { fields } = useFieldArray<{ projects: Project[] }, 'projects', '_id'>({ control: form.control, name: 'projects', keyName: '_id' });
    const { data: projectTemplates } = useQuery({
        queryKey: ['projectTemplates'],
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('User not logged in');
            const { data, error } = await client.from('projects').select().eq('user_id', session?.user?.id).filter('resume_id', 'is', null)
            if (error) throw error;
            return data;
        }
    })

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Projects</h3>
            <p className="mb-4 text-sm text-muted-foreground">Showcase specific projects you&apos;ve worked on that demonstrate your expertise and contributions. Include outcomes, technologies used, and your role in these projects.</p>
            {fields.map((field, index) => (
                <ProjectForm
                    field={field}
                    index={index}
                    form={form}
                    key={field._id}
                    onDeleteClick={() => {/** */ }}
                />
            ))}

            <MenuBar
                contentProps={{ side: 'bottom', align: 'start', className: 'min-w-72 shadow-sm' }}
                triggerProps={{ className: 'text-primary hover:text-primary flex items-center gap-1' }}
                trigger={(
                    <AddSectionBtn>
                        Add Projects
                    </AddSectionBtn>
                )}
                onClick={e => e.stopPropagation()}
            >
                {projectTemplates?.map((education) => {
                    const { title, id, start_date, end_date } = education
                    const endDate = end_date ? formatDate(end_date) : 'Now'
                    return (
                        <MenuItem className="py-2" key={id}>
                            <p className="font-medium">{title}</p>
                            {start_date && <p className="text-sm text-muted-foreground">{formatDate(start_date)} - {endDate}</p>}
                        </MenuItem>
                    )
                })}
            </MenuBar>
        </section>
    )
}

