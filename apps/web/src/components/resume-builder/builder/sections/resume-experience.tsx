import { deleteWorkExperience, updateWorkExperiences } from '@/actions/resume';
import { AlertDialog } from '@/components/alert-dialog';
import { MenuBar, MenuItem, Separator } from '@/components/menubar';
import { DateRenderer } from '@/components/resume-builder/date-renderer';
import { WorkExperienceForm } from '@/components/resume-builder/setup/work-experience/work-experience-form-item';
import { useToast } from '@/components/toast/use-toast';
import { debounce } from '@/utils/debounce';
import { type WorkExperience } from 'lib/types';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { getDefaultExperience } from 'src/hooks/useWorkExperience';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { v4 as uuid } from 'uuid';
import { AddSectionBtn } from '.';

/**
 * Work Experience section in resume builder
 */
export function WorkExperienceSection({ form, userId, templates }: { form: UseFormReturn<{ workExperience: WorkExperience[] }>, userId: string, templates: WorkExperience[] }) {
    const params = useParams() as { id: string }
    const { toast } = useToast()
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { fields, append, remove } = useFieldArray<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>({ control: form.control, name: 'workExperience', keyName: '_id' });
    const [highlightsToDelete, setHighlightToDelete] = useState<string[]>([])

    const { handleSubmit } = form

    // TODO: abstract this to a hook alongside the autosave functionality

    const {
        showDeleteDialog,
        onCancel,
        handleDelete,
        loading,
        setIsOpen,
        isOpen
    } = useDeleteModal({
        onDelete: async (id: string) => { await deleteWorkExperience(id, userId) }
    });

    const handleDeleteClick = (experience: WorkExperience, idx: number) => {
        setRemoveIdx(idx);
        if (!experience.id) return
        showDeleteDialog({ ...experience, id: experience.id });
    }

    //FIX: delete doesn't debounce
    const onDeleteOk = async () => {
        await handleDelete();
        remove(idxToRemove);
    }

    const saveFn = useCallback(async (values: { workExperience: WorkExperience[] }) => {
        const { success, error } = await updateWorkExperiences(values.workExperience, highlightsToDelete, params.id, userId);
        if (!success && error) {
            toast({
                variant: 'destructive',
                title: 'An error occurred'
            })
        }
    }, [toast, params.id, highlightsToDelete, userId])

    const watchedData = useWatch({
        control: form.control,
        name: 'workExperience',
        defaultValue: form.getValues('workExperience')
    })

    const debounced = debounce(async () => { await form.handleSubmit(saveFn)() }, 3000)
    const debouncedSubmit = useCallback(debounced, [form.handleSubmit, saveFn])

    useDeepCompareEffect(() => {
        if (form.formState.isDirty) {
            debouncedSubmit().then(() => { alert('Done') })
        }
    }, [watchedData, debouncedSubmit])

    return (
        <form onSubmit={handleSubmit(saveFn)}>
            <section className="mb-4">
                <h3 className="font-medium text-lg">Work Experience</h3>
                <p className="mb-4 text-sm text-muted-foreground">Detail your professional history, including past positions held, responsibilities, key achievements, and the skills you developed. Tailor this section to the job you&apos;re applying for.</p>
                <WorkExperienceForm fields={fields} form={form} onDeleteClick={handleDeleteClick} onHighlightDelete={setHighlightToDelete} />
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
                    {templates?.map((experience) => {
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
                        onClick={() => append(getDefaultExperience({ userId }))}
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
            </section>
        </form>
    )
}

/**
 * Generate new experience
 */
function generateNewExperience(experience: WorkExperience): WorkExperience {
    const id = uuid();
    const highlights = experience.highlights?.map(x => {
        x.id = uuid()
        x.work_experience_id = id
        return x
    }).filter(x => x)

    return { ...experience, id, highlights }
}