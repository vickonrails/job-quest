import { ChipsGroup } from '@components/chips/Chip';
import { Layout } from '@components/layout';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import NoteForm from '@components/notes/note-form';
import NotesList from '@components/notes/note-list';
import { JobEditSheet } from '@components/sheet/jobsEditSheet';
import { Typography } from '@components/typography';
import { formatDate } from '@components/utils';
import { useJobs } from '@hooks';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cn } from '@utils/cn';
import hashColors from '@utils/hash-colors';
import { type Database } from 'lib/database.types';
import { type Job, type Note, type Profile } from 'lib/types';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { ChevronLeft } from 'react-feather';
import { useEditSheet } from 'src/hooks/useEditModal';
import { Button, Rating, Spinner, Status_Lookup } from 'ui';
import { v4 as uuid } from 'uuid';

const JobDetailsPage = ({ session, profile, job, notes }: { session: Session, profile: Profile, job: Job, notes: Note[] }) => {
    const { data } = useJobs({ initialData: [job] }, job.id);
    const router = useRouter()
    const jobsData = data?.jobs[0]
    if (!jobsData) return null;

    return (
        <Layout session={session} profile={profile} containerClasses="p-6 overflow-auto">
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
    const client = useSupabaseClient<Database>()
    const router = useRouter();
    const queryClient = useQueryClient();
    const { isOpen: editSheetOpen, showEditSheet, setIsOpen, selectedEntity } = useEditSheet({});
    const labels = useMemo(() => {
        return job?.labels?.map(label => ({ label }))
    }, [job?.labels])

    const updateResumeMutation = useMutation({
        mutationFn: async (job: Job) => {
            const { error } = await client.from('jobs').update(job).eq('id', job.id)
            if (error) throw error
        },
        onSuccess: async (data, variables) => {
            job.resume_id = variables.resume_id;
            await queryClient.invalidateQueries({ queryKey: ['resume-templates'] })
        },
    })

    const { data } = useQuery({
        queryKey: ['resume-templates'],
        queryFn: async () => {
            const { data, error } = await client.from('resumes').select()
            if (error) throw error
            return data
        }
    })

    if (!job) return;

    const status = Status_Lookup.find((x, idx) => idx === job.status)

    const attachResume = async (resumeId?: string) => {
        if (!resumeId) return
        try {
            await updateResumeMutation.mutateAsync({ ...job, resume_id: resumeId })
        } catch {
            // throw error
        }
    }

    const navigateToNew = () => {
        return router.push(`/resumes/${uuid()}`)
    }

    return (
        <>
            <div className="flex bg-white gap-4">
                <div className="flex-2 grow-0 basis-2/3">
                    <header className="mb-6">
                        <div className="flex items-start mb-2">
                            <div className="mr-4">
                                <DefaultImage companyName={job.company_name} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <Typography variant="display-xs-md" className="mb-1 text-base-col">{job.position}</Typography>
                                    <Button size="sm" variant="outline" onClick={_ => showEditSheet(job)} className="inline-block py-1">Edit</Button>
                                </div>
                                <ul className="flex gap-6 text-light-text list-disc">
                                    <li className="list-none max-w-[200px]">
                                        <p>{job.company_name}</p>
                                    </li>
                                    {job.location && <li>{job.location}</li>}
                                    <li>{status}</li>
                                </ul>

                                <div className="flex flex-col items-start">
                                    {job.created_at && (
                                        <div className="flex text-muted-foreground items-center gap-1">
                                            Saved on {formatDate(job.created_at)}
                                        </div>
                                    )}
                                    <a target="_blank" rel="noreferrer noopener" className="flex gap-1 items-center text-sm underline text-primary" href={job.link ?? ''}>
                                        <span>Link on LinkedIn</span>
                                        <ExternalLink size={16} />
                                    </a>
                                </div>
                            </div>
                            <Rating size="md" value={job.priority ?? 0} />
                        </div>

                    </header>

                    <main className="mb-6">
                        <section className="border p-3 rounded-md">
                            <div className="text-base-col" id="__description" dangerouslySetInnerHTML={{ __html: job.description ?? '' }} />
                        </section>
                    </main>

                    <footer>
                        <ChipsGroup labels={labels ?? []} />
                    </footer>
                </div>
                <div className="flex-1 shrink-0 border-l grow-0 basis-1/3 p-6 flex flex-col gap-3 sticky top-0">
                    <section className="border-b pb-6">
                        <div className="mb-3 flex flex-col gap-3">
                            <header>
                                <h3 className="font-medium">Attach Resume</h3>
                                <p className="text-sm text-muted-foreground">Pick an already created resume or create a new one.</p>
                            </header>

                            {job.resume_id && (
                                <div className="grid h-24 w-24 p-2 border text-sm text-center text-muted-foreground">
                                    <p className="m-auto">
                                        {data?.find(resume => resume.id === job.resume_id)?.title}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <MenuBar
                                trigger={
                                    <Button variant="outline" className={cn('flex items-center gap-1', updateResumeMutation.isLoading && 'opacity-80 pointer-events-none')}>
                                        <span>{job.resume_id ? 'Replace Resume' : 'Add Resume'}</span>
                                        <ChevronDown size={16} />
                                    </Button>
                                }
                            >
                                {data?.map(x => (
                                    <MenuItem className="text-muted-foreground py-2" key={x.title} onClick={() => attachResume(x.id)}>{x.title}</MenuItem>
                                ))}
                                <Separator />
                                <MenuItem className="text-primary py-2" onClick={navigateToNew}>
                                    Create From Blank
                                </MenuItem>
                            </MenuBar>
                            {updateResumeMutation.isLoading && <Spinner />}
                        </div>
                    </section>

                    <section className="flex flex-col gap-2">
                        <h2>Notes</h2>
                        <NoteForm job={job} />
                        <NotesList notes={notes} job={job} />
                    </section>
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

function DefaultImage({ companyName }: { companyName: string }) {
    const variants = ['bg-indigo-500', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-pink-500', 'bg-purple-500']
    const backgroundColor = hashColors(companyName, variants)
    return (
        <div className={cn('text-white h-24 p-2 w-24 text-3xl font-bold', backgroundColor)}>
            {companyName.slice(0, 2)}
        </div>
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