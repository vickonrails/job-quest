import { AlertDialog } from '@components/alert-dialog';
import JobsKanban from '@components/kanban/kanban-container';
import { Layout } from '@components/layout';
import { JobEditSheet } from '@components/sheet/jobsEditSheet';
import { Spinner } from '@components/spinner';
import { useJobs } from '@hooks';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { type Job, type Profile } from 'lib/types';
import { ExternalLink } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { useEditSheet } from 'src/hooks/useEditModal';
import { Button } from 'ui';

const deleteTextWarning = `
    Are you sure you want to delete this job? 
    If you have notes associated with this job, they will be deleted as well. 
    This action cannot be undone.
`

const Tracker = ({ session, profile, jobs }: {
    session: Session, profile: Profile, jobs: Job[]
}) => {
    const { data, refetch } = useJobs({ initialData: jobs });
    const client = useSupabaseClient<Database>();
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
        <Layout session={session} profile={profile} pageTitle="Jobs" containerClasses="flex flex-col mt-4 overflow-auto">
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
    const supabase = createPagesServerClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()
    const { data: jobs } = await supabase.from('jobs').select();

    return {
        props: {
            session,
            profile,
            jobs
        }
    }
}

export default Tracker