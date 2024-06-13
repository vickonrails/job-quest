import { deleteWorkExperience, updateWorkExperiences } from '@/actions/resume';
import { DeleteDialog } from '@/components/delete-dialog';
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
import { AddExperienceItemDropdown } from './add-item-dropdown';

/**
 * Work Experience section in resume builder
 */
export function WorkExperienceSection({ form, userId, templates }: { form: UseFormReturn<{ workExperience: WorkExperience[] }>, userId: string, templates: WorkExperience[] }) {
    const params = useParams() as { id: string }
    const { toast } = useToast()
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { fields, append, remove } = useFieldArray<{ workExperience: WorkExperience[] }, 'workExperience', '_id'>({ control: form.control, name: 'workExperience', keyName: '_id' });

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
        const { success, error } = await updateWorkExperiences(values.workExperience, params.id, userId);
        if (!success && error) {
            toast({
                variant: 'destructive',
                title: 'An error occurred'
            })
        }
    }, [toast, params.id, userId])

    const watchedData = useWatch({
        control: form.control,
        name: 'workExperience',
        defaultValue: form.getValues('workExperience')
    })

    const debounced = debounce(async () => { await form.handleSubmit(saveFn)() }, 3000)
    const debouncedSubmit = useCallback(debounced, [form.handleSubmit, saveFn])

    useDeepCompareEffect(() => {
        if (form.formState.isDirty) {
            debouncedSubmit().then(() => {/** */ })
        }
    }, [watchedData, debouncedSubmit])

    const handleItemAdded = (experience: WorkExperience) => {
        const newWorkExperience = generateNewExperience(experience)
        append(newWorkExperience)
    }

    const handleBlankAdd = () => {
        append(getDefaultExperience({ userId }))
    }

    return (
        <form onSubmit={handleSubmit(saveFn)}>
            <section className="mb-4">
                <h3 className="font-medium text-lg">Work Experience</h3>
                <p className="mb-4 text-sm text-muted-foreground">Detail your professional history, including past positions held, responsibilities, key achievements, and the skills you developed. Tailor this section to the job you&apos;re applying for.</p>
                <WorkExperienceForm fields={fields} form={form} onDeleteClick={handleDeleteClick} />
                <AddExperienceItemDropdown
                    items={templates}
                    title="Add Experience"
                    onAddItem={handleItemAdded}
                    onAddBlank={handleBlankAdd}
                />
                <DeleteDialog
                    open={isOpen}
                    title="Delete Confirmation"
                    description="Are you sure you want to remove this experience"
                    onOk={onDeleteOk}
                    onOpenChange={setIsOpen}
                    onCancel={onCancel}
                    isProcessing={loading}
                />
            </section>
        </form >
    )
}

/**
 * Generate new experience
 */
function generateNewExperience(experience: WorkExperience): WorkExperience {
    const id = uuid();

    return { ...experience, id }
}