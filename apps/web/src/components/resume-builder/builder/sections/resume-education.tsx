import { AlertDialog } from '@components/alert-dialog';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { EducationForm } from '@components/resume-builder/setup/education/education-form-item';
import { formatDate } from '@components/utils';
import { type Database } from '@lib/database.types';
import { type Education } from '@lib/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { deleteEducation, getDefaultEducation } from 'src/hooks/useEducation';
import { v4 as uuid } from 'uuid';
import { AddSectionBtn } from '.';

/**
 * Education section in resume builder
 */
export function EducationSection({ session }: { session: Session }) {
    const form = useFormContext<{ education: Education[] }>();
    const client = useSupabaseClient<Database>();
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { fields, remove, append } = useFieldArray<{ education: Education[] }, 'education', '_id'>({ control: form.control, name: 'education', keyName: '_id' });
    const { data: educationTemplates } = useQuery({
        queryKey: ['educationTemplates'],
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('User not logged in');
            const { data, error } = await client.from('education').select().filter('resume_id', 'is', null)
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
        onDelete: async (id: string) => { await deleteEducation(id, client) }
    });

    const handleDeleteClick = (education: Education, idx: number) => {
        // if it already has an id, show a prompt to confirm deletion
        // if not, just remove from the array

        if (!education.id) {
            remove(idx);
            return;
        }
        setRemoveIdx(idx);
        if (!education.id) return
        showDeleteDialog({ ...education, id: education.id });
    }

    const onDeleteOk = async () => {
        await handleDelete();
        remove(idxToRemove);
        // TODO: might need to invalidate the query cache here
        // await queryClient.refetchQueries(['education']);
    }

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Education</h3>
            <p className="mb-4 text-sm text-muted-foreground">List your academic background, including degrees earned, institutions attended, and any honors or awards received. Relevant coursework can also be included here.</p>

            <EducationForm fields={fields} form={form} onDeleteClick={handleDeleteClick} />
            <MenuBar
                contentProps={{ side: 'bottom', align: 'start', className: 'min-w-72 shadow-sm' }}
                triggerProps={{ className: 'text-primary' }}
                Header="From your profile"
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
                        <MenuItem className="py-2" key={id} onClick={() => append({ ...education, id: uuid() })}>
                            <p className="font-medium">{institution} - {field_of_study}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(start_date)} - {endDate}</p>
                        </MenuItem>
                    )
                })}

                <Separator />
                <MenuItem
                    className="py-2"
                    onClick={() => append(getDefaultEducation())}
                >
                    <p>Add Blank</p>
                    <p className="text-sm text-muted-foreground">Add from scratch</p>
                </MenuItem>
            </MenuBar>

            <AlertDialog
                open={isOpen}
                title="Delete Confirmation"
                description="Are you sure you want to remove this Education?"
                onOk={onDeleteOk}
                onOpenChange={setIsOpen}
                onCancel={onCancel}
                isProcessing={loading}
            />
        </section>
    )

}