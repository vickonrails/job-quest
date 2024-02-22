import { AlertDialog } from '@components/alert-dialog';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { DateRenderer } from '@components/resume-builder/date-renderer';
import { WorkExperienceForm } from '@components/resume-builder/setup/work-experience/work-experience-form-item';
import { type Database } from '@lib/database.types';
import { type WorkExperience } from '@lib/types';
import { useSupabaseClient, type Session } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { deleteExperience, getDefaultExperience } from 'src/hooks/useWorkExperience';
import { v4 as uuid } from 'uuid';
import { AddSectionBtn } from '.';

/**
 * Work Experience section in resume builder
 */
export function WorkExperienceSection({ session, onHighlightDelete }: { session: Session, onHighlightDelete: Dispatch<SetStateAction<string[]>> }) {
    const client = useSupabaseClient<Database>()
    const form = useFormContext<{ workExperience: WorkExperience[] }>();
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { fields, append, remove } = useFieldArray<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>({ control: form.control, name: 'workExperience', keyName: '_id' });
    const { data: templateWorkExperience } = useQuery({
        queryKey: ['workExperienceTemplate'],
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('User not logged in');
            const { data, error } = await client.from('work_experience').select('*, highlights ( * )').filter('resume_id', 'is', null)
            if (error) throw error;
            return data;
        }
    })
    const {
        showDeleteDialog,
        onCancel,
        handleDelete,
        loading,
        setIsOpen,
        isOpen
    } = useDeleteModal({
        onDelete: async (id: string) => { await deleteExperience(id, client) }
    });

    const handleDeleteClick = (experience: WorkExperience, idx: number) => {
        setRemoveIdx(idx);
        if (!experience.id) return
        showDeleteDialog({ ...experience, id: experience.id });
    }

    const onDeleteOk = async () => {
        await handleDelete();
        remove(idxToRemove);
        // TODO: might need to invalidate the query cache here
        // await queryClient.refetchQueries(['work_experience']);
    }

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Work Experience</h3>
            <p className="mb-4 text-sm text-muted-foreground">Detail your professional history, including past positions held, responsibilities, key achievements, and the skills you developed. Tailor this section to the job you&apos;re applying for.</p>
            <WorkExperienceForm fields={fields} form={form} onDeleteClick={handleDeleteClick} onHighlightDelete={onHighlightDelete} />
            <MenuBar
                contentProps={{ side: 'bottom', align: 'start', className: 'min-w-72 shadow-sm' }}
                triggerProps={{ className: 'text-primary' }}
                Header="From your profile"
                trigger={(
                    <AddSectionBtn>
                        Add Experience
                    </AddSectionBtn>
                )}
                onClick={e => e.stopPropagation()}
            >
                {templateWorkExperience?.map((experience) => {
                    const newWorkExperience = generateNewExperience(experience)
                    return (
                        <MenuItem className="py-2" key={experience.id} onClick={() => append(newWorkExperience)}>
                            {experience.job_title}
                            <p className="text-sm text-muted-foreground flex gap-1">
                                <span>{experience.company_name}</span>
                                <span><DateRenderer startDate={experience.start_date} endDate={experience.end_date ?? ''} /></span>
                            </p>
                        </MenuItem>
                    )
                })}

                <Separator />
                <MenuItem
                    className="py-2"
                    onClick={() => append(getDefaultExperience())}
                >
                    <p>Add Blank</p>
                    <p className="text-sm text-muted-foreground">Add from scratch</p>
                </MenuItem>
            </MenuBar>

            <AlertDialog
                open={isOpen}
                title="Delete Confirmation"
                description="Are you sure you want to remove this experience"
                onOk={onDeleteOk}
                onOpenChange={setIsOpen}
                onCancel={onCancel}
                isProcessing={loading}
            />
        </section >
    )
}

function generateNewExperience(experience: WorkExperience): WorkExperience {
    const id = uuid();
    const highlights = experience.highlights?.map(x => {
        x.id = uuid()
        x.work_experience_id = id
        return x
    }).filter(x => x)

    return { ...experience, id, highlights }
}