import { AlertDialog } from '@components/alert-dialog';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { DateRenderer } from '@components/resume-builder/date-renderer';
import { WorkExperienceForm } from '@components/resume-builder/setup/work-experience/work-experience-form-item';
import { type Database } from '@lib/database.types';
import { type Highlight, type WorkExperience } from '@lib/types';
import { useSupabaseClient, type Session } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from '@utils/debounce';
import { setEntityId } from '@utils/set-entity-id';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { deleteExperience, getDefaultExperience } from 'src/hooks/useWorkExperience';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { v4 as uuid } from 'uuid';
import { AddSectionBtn } from '.';

/**
 * Work Experience section in resume builder
 */
export function WorkExperienceSection({ session }: { session: Session }) {
    const client = useSupabaseClient<Database>()
    const router = useRouter();
    const form = useFormContext<{ workExperience: WorkExperience[] }>();
    const { formState: { isDirty } } = form
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { fields, append, remove } = useFieldArray<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>({ control: form.control, name: 'workExperience', keyName: '_id' });
    // TODO: abstract this
    const { data: templateWorkExperience } = useQuery({
        queryKey: ['workExperienceTemplate'],
        queryFn: async () => {
            if (!session?.user?.id) throw new Error('User not logged in');
            const { data, error } = await client.from('work_experience').select('*, highlights ( * )').filter('resume_id', 'is', null)
            if (error) throw error;
            return data;
        }
    })

    const [deletedHighlights, setDeletedHighlights] = useState<string[]>([]);
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

    const saveFn = useCallback(async ({ workExperience }: { workExperience: WorkExperience[] }) => {
        const highlightsToDelete: string[] = [...deletedHighlights];
        const highlights: WorkExperience['highlights'] = [];
        const preparedWorkExperience = workExperience.map((experience) => {
            experience.resume_id = router.query.resume as string;
            if (!experience.id) {
                experience.id = uuid();
            }

            if (experience.highlights) {
                highlights.push(...experience.highlights);
                delete experience.highlights;
            }

            // TODO: look more into this (when considering the experience and end date saga)
            // if ((experience.still_working_here && experience.end_date) || !experience.end_date) {
            //     experience.end_date = null
            // }
            return experience
        });

        // TODO: delete selected highlights
        if (highlightsToDelete.length > 0) {
            const result = await client.from('highlights').delete().in('id', highlightsToDelete);
            if (result.error) throw new Error(result.error.message)
        }

        const preparedHighlights = highlights.filter(x => !highlightsToDelete.includes(x.id))
            .map(highlight => setEntityId<Highlight>(highlight, { overwrite: false }))

        try {
            const { data, error } = await client.from('work_experience').upsert(preparedWorkExperience)
            if (error) throw error;

            const { error: highlightsError } = await client.from('highlights').upsert(preparedHighlights);
            if (highlightsError) throw highlightsError;

            return data;
        } catch {
            // TODO: handle general error
        }
    }, [client, router, deletedHighlights])

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

    const handleSubmit = useCallback(
        debounce(async () => {
            await form.handleSubmit(saveFn)()
        }, 3000),
        [deletedHighlights]
    )

    const watchedData = useWatch({
        control: form.control,
        name: 'workExperience',
        defaultValue: form.getValues('workExperience')
    });

    console.log({ ExperienceWatchedData: watchedData })

    useDeepCompareEffect(() => {
        if (!form.getFieldState('workExperience').isDirty) return;
        handleSubmit().then(() => {
            // setDeletedHighlights([])
        }).catch(() => {
            // 
        });
    }, [watchedData, isDirty])

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Work Experience</h3>
            <p className="mb-4 text-sm text-muted-foreground">Detail your professional history, including past positions held, responsibilities, key achievements, and the skills you developed. Tailor this section to the job you&apos;re applying for.</p>
            <WorkExperienceForm fields={fields} form={form} onDeleteClick={handleDeleteClick} onHighlightDelete={setDeletedHighlights} />
            <MenuBar
                contentProps={{ side: 'bottom', align: 'start', className: 'min-w-72 shadow-sm' }}
                triggerProps={{ className: 'text-primary hover:text-primary' }}
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