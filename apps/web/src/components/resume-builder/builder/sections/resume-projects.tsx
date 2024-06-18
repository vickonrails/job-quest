import { updateProjects } from '@/db/actions/resume';
import { DeleteDialog } from '@/components/delete-dialog';
import { ProjectForm } from '@/components/resume-builder/setup/projects/project-form-item';
import { useToast } from '@/components/toast/use-toast';
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { type Project } from 'lib/types';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { deleteProject, getDefaultProject } from '@/hooks/use-profile-projects';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { v4 as uuid } from 'uuid';
import { AddProjectItemDropdown } from './add-item-dropdown';

interface ProjectsSectionProps {
    form: UseFormReturn<{ projects: Project[] }>
    templates: Project[]
    userId: string
}
/**
 * Projects section in resume builder
*/

export function ProjectsSection({ form, templates, userId }: ProjectsSectionProps) {
    const client = createClient();
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const { toast } = useToast();
    const { fields, append, remove } = useFieldArray<{ projects: Project[] }, 'projects', '_id'>({ control: form.control, name: 'projects', keyName: '_id' });
    const params = useParams() as { id: string }
    const {
        showDeleteDialog,
        onCancel,
        handleDelete,
        loading,
        setIsOpen,
        isOpen
    } = useDeleteModal({
        onDelete: async (id: string) => { await deleteProject(id, client) }
    });

    const watchedData = useWatch({
        control: form.control,
        name: 'projects',
        defaultValue: form.getValues('projects')
    });

    const saveFn = useCallback(async ({ projects }: { projects: Project[] }) => {
        const { success } = await updateProjects(projects, params.id)
        if (!success) {
            toast({
                variant: 'destructive',
                title: 'An error occurreds'
            })
        }
    }, [params.id, toast])

    const debounced = debounce(async () => { await form.handleSubmit(saveFn)() }, 3000)
    const debouncedSubmit = useCallback(debounced, [form.handleSubmit, saveFn])

    useDeepCompareEffect(() => {
        if (form.formState.isDirty) {
            debouncedSubmit().then(() => { /** */ })
        }
    }, [watchedData, debouncedSubmit])

    const onDeleteOk = async () => {
        await handleDelete();
        remove(idxToRemove);
    }

    const handleDeleteClick = (project: Project, idx: number) => {
        if (!project.id) {
            remove(idx);
            return;
        }
        setRemoveIdx(idx);
        if (!project.id) return
        showDeleteDialog({ ...project, id: project.id });
    }

    const handleAddItem = (project: Project) => {
        append({ ...project, resume_id: params.id, id: uuid() })
    }

    const handleAddBlank = () => {
        append(getDefaultProject({ userId }))
    }

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Projects</h3>
            <p className="mb-4 text-sm text-muted-foreground">Showcase specific projects you&apos;ve worked on that demonstrate your expertise and contributions. Include outcomes, technologies used, and your role in these projects.</p>
            <ProjectForm fields={fields} form={form} onDeleteClick={handleDeleteClick} />
            <AddProjectItemDropdown
                items={templates}
                title="Add Project"
                onAddBlank={handleAddBlank}
                onAddItem={handleAddItem}
            />

            <DeleteDialog
                open={isOpen}
                title="Delete Confirmation"
                description="Are you sure you want to remove this project"
                onOk={onDeleteOk}
                onOpenChange={setIsOpen}
                onCancel={onCancel}
                isProcessing={loading}
            />
        </section>
    )
}

