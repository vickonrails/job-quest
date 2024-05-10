import { AlertDialog } from '@/components/alert-dialog';
import { MenuBar, MenuItem, Separator } from '@/components/menubar';
import { ProjectForm } from '@/components/resume-builder/setup/projects/project-form-item';
import { debounce } from '@/utils/debounce';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { type Project } from 'lib/types';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useFieldArray, useFormContext, useWatch, type UseFormReturn } from 'react-hook-form';
import { formatDate } from 'shared';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { deleteProject, getDefaultProject } from 'src/hooks/useProjects';
import { useUserContext } from 'src/pages/_app';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { v4 as uuid } from 'uuid';
import { AddSectionBtn } from '.';

function useAutosave({ form }: { form: UseFormReturn<{ projects: Project[] }> }) {
    const router = useRouter();
    const client = createClient();

    const saveFn = async ({ projects }: { projects: Project[] }) => {
        const preparedProjects = projects.map((project) => {
            project.resume_id = router.query.resume as string;
            return project
        })

        const { data, error } = await client.from('projects').upsert(preparedProjects);
        if (error) throw error;
        return data
    }

    const handleSubmit = useCallback(
        debounce(async () => {
            await form.handleSubmit(saveFn)()
        }, 2000),
        []
    )

    const watchedData = useWatch({
        control: form.control,
        name: 'projects',
        defaultValue: form.getValues('projects')
    });

    // useDeepCompareEffect(() => {
    useEffect(() => {
        if (!form.getFieldState('projects').isDirty) return;
        handleSubmit().then(() => {
            // alert('Just edited the projects area')
        }).catch(() => {
            // 
        });
    }, [watchedData])
}

/**
 * Projects section in resume builder
*/
export function ProjectsSection() {
    const form = useFormContext<{ projects: Project[] }>();
    const client = createClient();
    const [idxToRemove, setRemoveIdx] = useState<number>();
    const user = useUserContext()
    const { fields, append, remove } = useFieldArray<{ projects: Project[] }, 'projects', '_id'>({ control: form.control, name: 'projects', keyName: '_id' });
    const { data: projectTemplates } = useQuery({
        queryKey: ['projectTemplates'],
        queryFn: async () => {
            if (!user?.id) throw new Error('User not logged in');
            const { data, error } = await client.from('projects')
                .select().filter('resume_id', 'is', null).eq('user_id', user.id)
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
        onDelete: async (id: string) => { await deleteProject(id, client) }
    });

    useAutosave({ form });

    const onDeleteOk = async () => {
        await handleDelete();
        remove(idxToRemove);
        // TODO: might need to invalidate the query cache here
        // await queryClient.refetchQueries(['projects']);
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
                {projectTemplates?.map((project) => {
                    const { title, id, start_date, end_date } = project
                    const endDate = end_date ? formatDate(end_date) : 'Now'
                    return (
                        <MenuItem className="py-2" key={id} onClick={() => append({ ...project, id: uuid() })}>
                            <p className="font-medium">{title}</p>
                            {start_date && <p className="text-sm text-muted-foreground">{formatDate(start_date)} - {endDate}</p>}
                        </MenuItem>
                    )
                })}

                <Separator />
                <MenuItem
                    className="py-2"
                    onClick={() => append(getDefaultProject({ userId: user?.id }))}
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

