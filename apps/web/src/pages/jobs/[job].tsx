import React from 'react'
import { Layout } from '@components/layout';
import { useRouter } from 'next/router';
import { type Database } from 'lib/database.types';
import { type Profile, type Job } from 'lib/types';
import { FullPageSpinner, Spinner } from '@components/spinner';
import { ChevronLeft } from 'react-feather'
import Image from 'next/image';
import { formatDate } from '@components/utils';
import { ChipsGroup } from '@components/chips/Chip';
import { Typography } from '@components/typography';
import { useJobs } from 'src/hooks/useJobs';
import { type GetServerSideProps } from 'next';
import { type Session, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEditSheet } from 'src/hooks/useEditModal';
import { JobEditSheet } from '@components/sheet/jobsEditSheet';
import NotesList from '@components/notes/note-list';
import NoteForm from '@components/notes/note-form';
import { Button, Rating, Status_Lookup } from 'ui';

const JobDetailsPage = ({ session, profile }: { session: Session, profile: Profile }) => {
    const router = useRouter();
    const jobId = router.query.job as string;
    const { data, isLoading, isRefetching } = useJobs({}, jobId)

    return (
        <Layout session={session} profile={profile}>
            <div>
                <button className="flex text-light-text mb-4 items-center" onClick={() => router.back()}>
                    <ChevronLeft size={20} />
                    Back
                </button>
                {isLoading ?
                    <FullPageSpinner /> :
                    <JobDetails job={data?.jobs[0]} isRefetching={isRefetching} />
                }
            </div>
        </Layout>
    )
}


const JobDetails = ({ job, isRefetching }: { job?: Job, isRefetching: boolean }) => {
    const { isOpen: editSheetOpen, showEditSheet, setIsOpen, selectedEntity } = useEditSheet({});

    if (!job) return;

    return (
        <>
            <div className="flex bg-white gap-4">
                <div className="flex-2 grow-0 basis-2/3">
                    <header className="mb-6">
                        <div className="flex items-center mb-2">
                            {job?.company_site && (
                                <div className="mr-5">
                                    <Image
                                        src={`https://logo.clearbit.com/${job.company_site}`}
                                        alt={job.company_name}
                                        width={80}
                                        height={80}
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <Typography variant="display-xs-md" className="mb-1 text-base-col">{job.position}</Typography>
                                    <Button size="sm" variant="outline" onClick={_ => showEditSheet(job)} fillType="outlined" className="inline-block py-1">Edit</Button>
                                    {isRefetching && <Spinner />}
                                </div>
                                <ul className="flex gap-6 text-light-text list-disc">
                                    <li className="list-none max-w-[200px]">
                                        <Typography variant="body-md">{job.company_name}</Typography>
                                    </li>
                                    {job.location && <li>{job.location}</li>}
                                    <li>{Status_Lookup[job.status]}</li>
                                </ul>
                            </div>
                            <Rating size="md" value={job.priority ?? 0} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Typography variant="body-sm"><a target="_blank" rel="noreferrer noopener" className="underline" href={job.link ?? ''}>{job.link}</a></Typography>
                            {job.created_at && <Typography variant="body-sm">Saved on {formatDate(job.created_at)}</Typography>}
                        </div>
                    </header>

                    <main className="mb-6">
                        <section className="border border-gray-100 p-3">
                            <div className="text-base-col" id="__description" dangerouslySetInnerHTML={{ __html: job.description ?? '' }} />
                        </section>
                    </main>

                    <footer>
                        <ChipsGroup labels={job.labels ?? []} />
                    </footer>
                </div>
                <div className="flex-1 shrink-0 border-l grow-0 basis-1/3 p-6 flex flex-col gap-3">
                    <h2>Notes</h2>
                    <NoteForm job={job} />
                    <NotesList job={job} />
                </div>
            </div>
            {editSheetOpen && (
                <JobEditSheet
                    entity={selectedEntity}
                    open={editSheetOpen}
                    title="Edit Job"
                    onOpenChange={setIsOpen}
                />
            )}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();
    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    return {
        props: {
            session,
            profile
        }
    }
}

export default JobDetailsPage