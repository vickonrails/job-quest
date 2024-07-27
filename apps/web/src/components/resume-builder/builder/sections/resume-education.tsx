import { DeleteDialog } from '@/components/delete-dialog';
import { EducationForm } from '@/components/resume-builder/setup/education/education-form-item';
import { useToast } from '@/components/toast/use-toast';
import { deleteEducation } from '@/db/api/actions/education.action';
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { type SupabaseClient } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Education } from 'lib/types';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';
import { type Database } from 'shared';
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

async function updateEducationQuery(client: SupabaseClient<Database>, education: Education[]) {
    return client.from('education').upsert(education).select()
}

/**
 * Education section in resume builder
*/
export function EducationSection({ form, templates, userId }: EducationSectionProps) {
    const { toast } = useToast()
    const params = useParams() as { id: string }
    const client = createClient()
    const queryClient = useQueryClient()
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

    const updateMutation = useMutation({
        mutationFn: async (education: Education[]) => {
            const { data } = await updateEducationQuery(client, education)
            return data
        },
        onSuccess(data) {
            const newValue = data ? [...data, ...templates] : [...templates]
            queryClient.setQueryData([`resume_${params.id}`, 'education'], newValue)
        },
    })

    const saveFn = useCallback(async ({ education }: { education: Education[] }) => {
        await updateMutation.mutateAsync(education)
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const debounced = debounce(async () => { await form.handleSubmit(saveFn)() }, 1500)
    const debouncedSubmit = useCallback(debounced, [form.handleSubmit, saveFn])

    useDeepCompareEffect(() => {
        if (form.formState.isDirty) {
            debouncedSubmit().then(() => { /** */ })
        }
    }, [watchedData, debouncedSubmit])

    const handleAddBlank = () => {
        append(getDefaultEducation({ userId, resume_id: params.id }))
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