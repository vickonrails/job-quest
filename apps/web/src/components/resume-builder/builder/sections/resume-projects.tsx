import { DeleteDialog } from '@/components/delete-dialog';
import { ProjectForm } from '@/components/resume-builder/setup/projects/project-form-item';
import { useToast } from '@/components/toast/use-toast';
import { deleteProject, getDefaultProject } from '@/hooks/use-profile-projects';
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { type SupabaseClient } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Project } from 'lib/types';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';
import { type Database } from 'shared';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { v4 as uuid } from 'uuid';
import { AddProjectItemDropdown } from './add-item-dropdown';

async function updateProjectsQuery(client: SupabaseClient<Database>, projects: Project[]) {
    return client.from('projects').upsert(projects).select()
}

interface ProjectsSectionProps {
    form: UseFormReturn<{ projects: Project[] }>
    templates: Project[]
    userId: string
}
/**
 * Projects section in resume builder
*/

export function ProjectsSection({ form, templates, userId }: ProjectsSectionProps) {
    const client = createClient()
    const queryClient = useQueryClient()

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

    // TODO: error handling
    const updateMutation = useMutation({
        mutationFn: async (experiences: Project[]) => {
            const { data } = await updateProjectsQuery(client, experiences)
            return data
        },
        onSuccess: (data) => {
            const newValue = data ? [...data, ...templates] : [...templates]
            queryClient.setQueryData([`resume_${params.id}`, 'projects'], newValue)
        },
    })

    const watchedData = useWatch({
        control: form.control,
        name: 'projects',
        defaultValue: form.getValues('projects')
    });

    const saveFn = useCallback(async ({ projects }: { projects: Project[] }) => {
        await updateMutation.mutateAsync(projects)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id])

    const debounced = debounce(async () => { await form.handleSubmit(saveFn)() }, 1500)
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
        append(getDefaultProject({ userId , resume_id: params.id}))
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

