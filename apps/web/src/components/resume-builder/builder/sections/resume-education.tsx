import { updateEducation } from '@/actions/resume';
import { AlertDialog } from '@/components/alert-dialog';
import { MenuBar, MenuItem, Separator } from '@/components/menubar';
import { EducationForm } from '@/components/resume-builder/setup/education/education-form-item';
import { useToast } from '@/components/toast/use-toast';
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { type Education } from 'lib/types';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';
import { formatDate } from 'shared';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { deleteEducation, getDefaultEducation } from 'src/hooks/useEducation';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { v4 as uuid } from 'uuid';
import { AddSectionBtn } from '.';

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
        const { success, error } = await updateEducation(education, [], params.id, userId)
        if (success && error) {
            toast({
                variant: 'destructive',
                title: 'An error occurred'
            })
        }

    }, [params.id, toast, userId])

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
    }

    const debounced = debounce(async () => { await form.handleSubmit(saveFn)() }, 3000)
    const debouncedSubmit = useCallback(debounced, [form.handleSubmit, saveFn])

    useDeepCompareEffect(() => {
        if (form.formState.isDirty) {
            debouncedSubmit().then(() => { alert('Done') })
        }
    }, [watchedData, debouncedSubmit])

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
                setHighlightsToDelete={() => {/** */ }}
            />
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
                {templates?.map((education) => {
                    const { institution, field_of_study, id, start_date, end_date } = education
                    const endDate = end_date ? formatDate(end_date) : 'Now'

                    const newWorkExperience = generateNewExperience({ ...education, resume_id: params.id })
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
                    onClick={() => append(getDefaultEducation({ userId }))}
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