import { AlertDialog } from '@components/alert-dialog';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { EducationForm } from '@components/resume-builder/setup/education/education-form-item';
import { formatDate } from '@components/utils';
import { type Database } from '@lib/database.types';
import { type Education, type Highlight } from '@lib/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Session } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { debounce } from '@utils/debounce';
import { setEntityId } from '@utils/set-entity-id';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useFieldArray, useFormContext, useWatch, type UseFormReturn } from 'react-hook-form';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { deleteEducation, getDefaultEducation } from 'src/hooks/useEducation';
import useDeepCompareEffect from 'use-deep-compare-effect';
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
            const { data, error } = await client.from('education').select('*, highlights ( * )').filter('resume_id', 'is', null)
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

    // TODO: do I need to show the modal for unsaved items?
    const handleDeleteClick = (education: Education, idx: number) => {
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

    const { setHighlightsToDelete } = useAutosave({ form });

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Education</h3>
            <p className="mb-4 text-sm text-muted-foreground">List your academic background, including degrees earned, institutions attended, and any honors or awards received. Relevant coursework can also be included here.</p>

            <EducationForm fields={fields} form={form} onDeleteClick={handleDeleteClick} setHighlightsToDelete={setHighlightsToDelete} />
            <MenuBar
                contentProps={{ side: 'bottom', align: 'start', className: 'min-w-72 shadow-sm' }}
                triggerProps={{ className: 'text-primary hover:text-primary' }}
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

                    const newWorkExperience = generateNewExperience(education)
                    return (
                        <MenuItem className="py-2" key={id} onClick={() => append(newWorkExperience)}>
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

/**
 * Autosave hook for education section
 */
function useAutosave({ form }: { form: UseFormReturn<{ education: Education[] }> }) {
    const router = useRouter();
    const client = useSupabaseClient<Database>();
    const [highlightsToDelete, setHighlightsToDelete] = useState<string[]>([])

    const saveFn = useCallback(async ({ education }: { education: Education[] }) => {
        const highlightsToDeleteArr: string[] = [...highlightsToDelete];
        const highlights: Education['highlights'] = [];
        const preparedEducation = education.map((education) => {
            education.resume_id = router.query.resume as string;
            if (education.highlights) {
                highlights.push(...education.highlights)
                delete education.highlights
            }

            // TODO: figure out this
            // if ((education.still_studying_here && education.end_date) || !education.end_date) {
            //     education.end_date = null
            // }
            return education
        })

        if (highlightsToDeleteArr.length > 0) {
            const result = await client.from('highlights').delete().in('id', highlightsToDeleteArr);
            if (result.error) throw new Error(result.error.message)
        }

        const preparedHighlights = highlights.filter(x => !highlightsToDeleteArr.includes(x.id) && x.text)
            .map(highlight => setEntityId<Highlight>(highlight, { overwrite: false }))

        try {
            const { error } = await client.from('education').upsert(preparedEducation);
            if (error) throw error;

            const { error: highlightsError } = await client.from('highlights').upsert(preparedHighlights).select();
            if (highlightsError) throw highlightsError
        } catch {
            // 
        }
    }, [highlightsToDelete, router, client])

    const watchedData = useWatch({
        control: form.control,
        name: 'education',
        defaultValue: form.getValues('education')
    });

    const handleSubmit = useCallback(
        debounce(async () => {
            await form.handleSubmit(saveFn)()
        }, 2000),
        [highlightsToDelete]
    )

    useDeepCompareEffect(() => {
        if (!form.getFieldState('education').isDirty) return;
        handleSubmit().then(() => {
            // alert('Just edited the education area')
        }).catch(() => {
            // 
        });
    }, [watchedData])

    return { setHighlightsToDelete }
}

/**
 * Generate new experience
 */
function generateNewExperience(education: Education): Education {
    const id = uuid();
    const highlights = education.highlights?.map(x => {
        x.id = uuid()
        x.education_id = id
        return x
    }).filter(x => x)

    return { ...education, id, highlights }
}