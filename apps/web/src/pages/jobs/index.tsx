import { AlertDialog } from '@/components/alert-dialog';
import JobsKanban from '@/components/kanban/kanban-container';
// import { Layout } from '@/components/layout';
import { JobEditSheet } from '@/components/sheet/jobsEditSheet';
import { useJobs } from '@/hooks';
import { type User } from '@supabase/auth-helpers-nextjs';
import { type Job, type Profile } from 'lib/types';
import { ExternalLink } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { useEditSheet } from 'src/hooks/useEditModal';
import { Button, Spinner } from 'ui';
import { createClient as createBrowserClient } from '../../../lib/supabase/component';
import { createClient } from '../../../lib/supabase/server-prop';

const deleteTextWarning = `
    Are you sure you want to delete this job? 
    If you have notes associated with this job, they will be deleted as well. 
    This action cannot be undone.
`

const Tracker = ({ user, profile, jobs }: {
    user: User, profile: Profile, jobs: Job[]
}) => {
    const { data, refetch } = useJobs(user.id, { initialData: jobs },);
    const client = createBrowserClient();
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
            const { error } = await client.from('jobs').delete().eq('id', id);
            if (error) throw error;
        },
        refresh: async () => {
            await refetch();
        }
    })
    const { isOpen: editSheetOpen, showEditSheet, selectedEntity, closeEditSheet } = useEditSheet<Job>({})

    const openEditSheet = (job?: Job) => {
        showEditSheet(job)
    }

    return (
        <Layout profile={profile} pageTitle="Jobs" containerClasses="flex flex-col mt-4 overflow-auto">
            <section className="flex justify-between items-center mb-3 px-4">
                <h1 className="text-xl flex font-bold gap-2 items-center">
                    {isUpdating && <Spinner />}
                </h1>
                <Button onClick={() => openEditSheet()}>Add New</Button>
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
                    icons={<FullViewButton job={selectedEntity ?? undefined} />}
                    entity={selectedEntity}
                    open={editSheetOpen}
                    title="Edit Job"
                    onOpenChange={closeEditSheet}
                />
            )}

            <AlertDialog
                open={deleteModalOpen}
                title="Delete Confirmation"
                description={deleteTextWarning}
                onOk={handleDelete}
                // TODO: figure out why this isn't working
                onOpenChange={setIsDeleteModalOpen}
                onCancel={onCancel}
                isProcessing={isDeleting}
            />
        </Layout>
    )
}

const FullViewButton = ({ job }: { job?: Job }) => {
    if (!job) return;
    return (
        <Button asChild variant="ghost" size="icon">
            <Link href={`/jobs/${job?.id ?? ''}`}>
                <ExternalLink size={18} />
            </Link>
        </Button>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context);
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single()
    const { data: jobs } = await supabase.from('jobs').select();

    return {
        props: {
            user,
            profile,
            jobs
        }
    }
}

export default Tracker