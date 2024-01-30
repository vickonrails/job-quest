import JobsKanban from '@components/kanban/kanban-container';
import { Layout } from '@components/layout';
import { JobEditSheet } from '@components/sheet/jobsEditSheet';
import { Spinner } from '@components/spinner';
import { useJobs } from '@hooks';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type Database } from 'lib/database.types';
import { type Job, type Profile } from 'lib/types';
import { ExternalLink } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { useEditSheet } from 'src/hooks/useEditModal';
import { Button } from 'ui';

const Tracker = ({ session, profile, jobs }: {
    session: Session, profile: Profile, jobs: Job[]
}) => {
    const { data } = useJobs({ initialData: jobs });
    const [isUpdating, setIsUpdating] = useState(false)
    // const {
    //     showDeleteDialog,
    //     isOpen: deleteModalOpen,
    //     onCancel,
    //     handleDelete,
    //     setIsOpen: setIsDeleteModalOpen,
    //     loading: isDeleting
    // } = useDeleteModal({})
    const { isOpen: editSheetOpen, showEditSheet, setIsOpen, selectedEntity } = useEditSheet<Job>({})

    const openEditSheet = (job?: Job) => {
        showEditSheet(job)
    }

    return (
        <Layout session={session} profile={profile} pageTitle="Jobs" containerClasses="p-6">
            <section className="flex justify-between items-center mb-3">
                <h1 className="text-xl flex font-bold gap-2 items-center">
                    {isUpdating && <Spinner />}
                </h1>
                <Button onClick={() => openEditSheet()}>Add New</Button>
            </section>

            <JobsKanban
                openEditSheet={openEditSheet}
                jobs={data?.jobs ?? []}
                onUpdateStart={() => setIsUpdating(true)}
                onUpdateEnd={() => setIsUpdating(false)}
            />

            {editSheetOpen && (
                <JobEditSheet
                    icons={
                        <Button asChild variant="ghost" size="icon">
                            <Link href={`/jobs/${selectedEntity?.id ?? ''}`}>
                                <ExternalLink size={18} />
                            </Link>
                        </Button>
                    }
                    entity={selectedEntity}
                    open={editSheetOpen}
                    title="Edit Job"
                    onOpenChange={setIsOpen}
                />
            )}
        </Layout>
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
    const { data: jobs } = await supabase.from('jobs').select().eq('user_id', session?.user.id)

    return {
        props: {
            session,
            profile,
            jobs
        }
    }
}

export default Tracker