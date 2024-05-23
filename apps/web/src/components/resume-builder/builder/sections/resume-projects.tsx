import { updateProjects } from '@/actions/resume';
import { AlertDialog } from '@/components/alert-dialog';
import { MenuBar, MenuItem, Separator } from '@/components/menubar';
import { ProjectForm } from '@/components/resume-builder/setup/projects/project-form-item';
import { useToast } from '@/components/toast/use-toast';
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { type Project } from 'lib/types';
import { useParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useFieldArray, useWatch, type UseFormReturn } from 'react-hook-form';
import { formatDate } from 'shared';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { deleteProject, getDefaultProject } from 'src/hooks/useProjects';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { v4 as uuid } from 'uuid';
import { AddSectionBtn } from './add-section-button';

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

    return (
        <section className="mb-4">
            <h3 className="font-medium text-lg">Projects</h3>
            <p className="mb-4 text-sm text-muted-foreground">Showcase specific projects you&apos;ve worked on that demonstrate your expertise and contributions. Include outcomes, technologies used, and your role in these projects.</p>
            <ProjectForm fields={fields} form={form} onDeleteClick={handleDeleteClick} />
            <MenuBar
                contentProps={{ side: 'bottom', align: 'start', className: 'min-w-72 shadow-sm' }}
                triggerProps={{ className: 'text-primary hover:text-primary' }}
                Header="From your profile"
                trigger={(
                    <AddSectionBtn>
                        Add Project
                    </AddSectionBtn>
                )}
                onClick={e => e.stopPropagation()}
            >
                {templates?.map((project) => {
                    const { title, id, start_date, end_date } = project
                    const endDate = end_date ? formatDate(end_date) : 'Now'
                    return (
                        <MenuItem className="py-2" key={id} onClick={() => append({ ...project, resume_id: params.id, id: uuid() })}>
                            <p className="font-medium">{title}</p>
                            {start_date && <p className="text-sm text-muted-foreground">{formatDate(start_date)} - {endDate}</p>}
                        </MenuItem>
                    )
                })}

                <Separator />
                <MenuItem
                    className="py-2"
                    onClick={() => append(getDefaultProject({ userId }))}
                >
                    <p>Add Blank</p>
                    <p className="text-sm text-muted-foreground">Add from scratch</p>
                </MenuItem>
            </MenuBar>

            <AlertDialog
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

