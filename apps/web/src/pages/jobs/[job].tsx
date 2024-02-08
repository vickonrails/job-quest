import { ChipsGroup } from '@components/chips/Chip';
import { Layout } from '@components/layout';
import NoteForm from '@components/notes/note-form';
import NotesList from '@components/notes/note-list';
import { JobEditSheet } from '@components/sheet/jobsEditSheet';
import { Typography } from '@components/typography';
import { formatDate } from '@components/utils';
import { useJobs } from '@hooks';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type Database } from 'lib/database.types';
import { type Job, type Note, type Profile } from 'lib/types';
import { type GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ChevronLeft } from 'react-feather';
import { useEditSheet } from 'src/hooks/useEditModal';
import { Button, Rating, Status_Lookup } from 'ui';

const JobDetailsPage = ({ session, profile, job, notes }: { session: Session, profile: Profile, job: Job, notes: Note[] }) => {
    const { data } = useJobs({ initialData: [job] }, job.id);
    const router = useRouter()
    const jobsData = data?.jobs[0]
    if (!jobsData) return null;

    return (
        <Layout session={session} profile={profile} containerClasses="p-6">
            <div>
                <button className="flex text-light-text mb-4 items-center" onClick={() => router.back()}>
                    <ChevronLeft size={20} />
                    Back
                </button>
                <JobDetails job={jobsData} notes={notes} />
            </div>
        </Layout>
    )
}


const JobDetails = ({ job, notes }: { job: Job, notes: Note[] }) => {
    const { isOpen: editSheetOpen, showEditSheet, setIsOpen, selectedEntity } = useEditSheet({});
    const labels = useMemo(() => {
        return job?.labels?.map(label => ({ label }))
    }, [job?.labels])

    if (!job) return;

    const status = Status_Lookup.find((x, idx) => idx === job.status)

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
                                    <Button size="sm" variant="outline" onClick={_ => showEditSheet(job)} className="inline-block py-1">Edit</Button>
                                </div>
                                <ul className="flex gap-6 text-light-text list-disc">
                                    <li className="list-none max-w-[200px]">
                                        <Typography variant="body-md">{job.company_name}</Typography>
                                    </li>
                                    {job.location && <li>{job.location}</li>}
                                    <li>{status}</li>
                                </ul>
                            </div>
                            <Rating size="md" value={job.priority ?? 0} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Typography variant="body-sm"><a target="_blank" rel="noreferrer noopener" className="underline" href={job.link ?? ''}>{job.link}</a></Typography>
                            {job.created_at && <Typography variant="body-sm">Saved on {formatDate(job.created_at)}</Typography>}
                        </div>
                    </header>

                    <footer>
                        <ChipsGroup labels={labels ?? []} />
                    </footer>
                </div>
                <div className="flex-1 shrink-0 border-l grow-0 basis-1/3 p-6 flex flex-col gap-3">
                    <h2>Notes</h2>
                    <NoteForm job={job} />
                    <NotesList notes={notes} job={job} />
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
    const supabase = createPagesServerClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();
    const jobId = context.query.job as string

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()
    const { data: job } = await supabase.from('jobs').select().eq('id', jobId).single()
    const { data: notes } = await supabase.from('notes').select().eq('job_id', jobId).order('created_at', { ascending: false });
    // redirect back to jobs page if job doesn't exist

    return {
        props: {
            session,
            profile,
            job,
            notes
        }
    }
}

export default JobDetailsPage