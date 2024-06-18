import { DeleteDialog } from '@/components/delete-dialog';
import { EducationForm } from '@/components/resume-builder/setup/education/education-form-item';
import { useToast } from '@/components/toast/use-toast';
import { deleteEducation } from '@/db/actions/education';
import { updateEducation } from '@/db/actions/resume';
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { type Education } from 'lib/types';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';
import { getDefaultEducation } from 'src/hooks/use-profile-education';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { v4 as uuid } from 'uuid';
import { AddEducationItemDropdown } from './add-item-dropdown';

interface EducationSectionProps {
    form: UseFormReturn<{ education: Education[] }>
    templates: Education[]
    userId: string
}
/**
 * Education section in resume builder
*/
export function EducationSection({ form, templates, userId }: EducationSectionProps) {
    const client = createClient();
    const { toast } = useToast()
    const params = useParams() as { id: string }
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { fields, remove, append } = useFieldArray<{ education: Education[] }, 'education', '_id'>({
        control: form.control,
        name: 'education',
        keyName: '_id'
    });

    const watchedData = useWatch({
        control: form.control,
        name: 'education',
        defaultValue: form.getValues('education')
    });

    const saveFn = useCallback(async ({ education }: { education: Education[] }) => {
        const { success, error } = await updateEducation(education, params.id)
        if (!success && error) {
            toast({
                variant: 'destructive',
                title: 'An error occurred'
            })
        }

    }, [params.id, toast])

    const {
        showDeleteDialog,
        onCancel,
        handleDelete,
        loading,
        setIsOpen,
        isOpen
    } = useDeleteModal({
        onDelete: async (id: string) => { await deleteEducation(id) }
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
    }

    const debounced = debounce(async () => { await form.handleSubmit(saveFn)() }, 3000)
    const debouncedSubmit = useCallback(debounced, [form.handleSubmit, saveFn])

    useDeepCompareEffect(() => {
        if (form.formState.isDirty) {
            debouncedSubmit().then(() => { /** */ })
        }
    }, [watchedData, debouncedSubmit])

    const handleAddBlank = () => {
        append(getDefaultEducation({ userId }))
    }

    const handleAddItem = (education: Education) => {
        const newEducation = generateNewExperience({ ...education, resume_id: params.id })
        append(newEducation)
    }

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Education</h3>
            <p className="mb-4 text-sm text-muted-foreground">
                List your academic background, including degrees earned, institutions attended, and any honors or awards received. Relevant coursework can also be included here.
            </p>
            <EducationForm
                fields={fields}
                form={form}
                onDeleteClick={handleDeleteClick}
            />

            <AddEducationItemDropdown
                items={templates}
                title="Add Education"
                onAddBlank={handleAddBlank}
                onAddItem={handleAddItem}
            />

            <DeleteDialog
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
 * Generate new experience
 */
function generateNewExperience(education: Education): Education {
    const id = uuid();
    return { ...education, id, highlights: '' }
}