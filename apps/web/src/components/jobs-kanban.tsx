'use client'

import { deleteJobQuery } from '@/db/queries/jobs.query';
import { useJobs } from '@/hooks';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { useEditSheet } from '@/hooks/useEditModal';
import { createClient } from '@/utils/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { type Job } from 'lib/types';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from 'ui/button';
import { Spinner } from 'ui/spinner';
import { DeleteDialog } from './delete-dialog';
import JobsKanban from './kanban/kanban-container';
import { JobEditSheet } from './sheet/jobs-edit-sheet';

const FullViewButton = ({ job }: { job?: Job }) => {
    if (!job) return;
    return (
        <Button asChild variant="ghost" size="icon">
            <Link href={`/jobs-tracker/${job?.id ?? ''}`}>
                <ExternalLink size={18} />
            </Link>
        </Button>
    )
}

const deleteTextWarning = `
    Are you sure you want to delete this job? 
    If you have notes associated with this job, they will be deleted as well. 
    This action cannot be undone.
`

async function deleteJob(id: string) {
    const client = createClient()
    const { data: { user } } = await client.auth.getUser()
    if (!user?.id) throw new Error('userId not provided')
    await deleteJobQuery(client, id, user.id)
}

export default function JobsKanbanContainer({ jobs: initialData }: { jobs: Job[] }) {
    const [isUpdating, setIsUpdating] = useState(false)
    const queryClient = useQueryClient()
    const { data } = useJobs({ initialData })

    const {
        showDeleteDialog,
        isOpen: deleteModalOpen,
        onCancel,
        handleDelete,
        setIsOpen: setIsDeleteModalOpen,
        loading: isDeleting
    } = useDeleteModal({
        onDelete: async (id: string) => {
            await deleteJob(id)
            await queryClient.invalidateQueries(['jobs'])
        }
    })

    const { isOpen: editSheetOpen, showEditSheet, selectedEntity, closeEditSheet } = useEditSheet<Job>({})
    const openEditSheet = (job?: Job) => { showEditSheet(job) }

    const onEditSuccess = async () => {
        await queryClient.invalidateQueries({ queryKey: ['jobs'] })
    }

    return (
        <>
            <section className="flex justify-between items-center mb-3 px-4">
                <h1 className="text-xl flex font-bold gap-2 items-center">
                    {isUpdating && <Spinner />}
                </h1>
                <section>
                    <Button variant="link" asChild>
                        <Link href="/jobs-tracker/import-jobs">Import Jobs (CSV)</Link>
                    </Button>
                    <Button size="sm" onClick={() => openEditSheet()}>Add New</Button>
                </section>
            </section>
            <JobsKanban
                openEditSheet={openEditSheet}
                openDeleteDialog={showDeleteDialog}
                jobs={data?.jobs ?? []}
                onUpdateStart={() => setIsUpdating(true)}
                onUpdateEnd={() => setIsUpdating(false)}
            />
            {editSheetOpen && (
                <JobEditSheet
                    onSuccess={onEditSuccess}
                    icons={<FullViewButton job={selectedEntity ?? undefined} />}
                    entity={selectedEntity}
                    open={editSheetOpen}
                    title="Edit Job"
                    onOpenChange={closeEditSheet}
                />
            )}

            <DeleteDialog
                open={deleteModalOpen}
                title="Delete Confirmation"
                description={deleteTextWarning}
                onOk={handleDelete}
                // TODO: figure out why this isn't working
                onOpenChange={setIsDeleteModalOpen}
                onCancel={onCancel}
                isProcessing={isDeleting}
            />
        </>
    )
}
