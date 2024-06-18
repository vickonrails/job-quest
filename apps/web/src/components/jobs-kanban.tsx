'use client'

import { deleteJob } from '@/db/actions/job';
import { useDeleteModal } from '@/hooks/useDeleteModal';
import { useEditSheet } from '@/hooks/useEditModal';
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

export default function JobsKanbanContainer({ jobs }: { jobs: Job[] }) {
    const [isUpdating, setIsUpdating] = useState(false)

    const {
        showDeleteDialog,
        isOpen: deleteModalOpen,
        onCancel,
        handleDelete,
        setIsOpen: setIsDeleteModalOpen,
        loading: isDeleting
    } = useDeleteModal({
        onDelete: async (id: string) => {
            const { success } = await deleteJob(id)
            if (!success) throw new Error();
        }
    })

    const { isOpen: editSheetOpen, showEditSheet, selectedEntity, closeEditSheet } = useEditSheet<Job>({})
    const openEditSheet = (job?: Job) => { showEditSheet(job) }

    return (
        <>
            <section className="flex justify-between items-center mb-3 px-4">
                <h1 className="text-xl flex font-bold gap-2 items-center">
                    {isUpdating && <Spinner />}
                </h1>
                <Button size="sm" onClick={() => openEditSheet()}>Add New</Button>
            </section>
            <JobsKanban
                openEditSheet={openEditSheet}
                openDeleteDialog={showDeleteDialog}
                jobs={jobs ?? []}
                onUpdateStart={() => setIsUpdating(true)}
                onUpdateEnd={() => setIsUpdating(false)}
            />
            {editSheetOpen && (
                <JobEditSheet
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
