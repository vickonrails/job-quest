import React, { type HTMLAttributes, useState } from 'react'
import { Layout } from '@components/layout';
import { useRouter } from 'next/router';
import { type Database } from 'lib/database.types';
import { type Profile, type Job, type NoteInsertDTO, type Note } from 'lib/types';
import { FullPageSpinner, Spinner } from '@components/spinner';
import { ChevronLeft, Trash } from 'react-feather'
import Image from 'next/image';
import { Rating } from '@components/rating/Rating';
import { Chip } from '@components/chips';
import { djb2Hash, formatDate } from '@components/utils';
import { type ChipVariants } from '@components/chips/Chip';
import { Status_Lookup } from '@components/table/job/JobsTable';
import { Typography } from '@components/typography';
import { Button } from '@components/button';
import { useJobs } from 'src/hooks/useJobs';
import { type GetServerSideProps } from 'next';
import { type Session, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useEditSheet } from 'src/hooks/useEditModal';
import { JobEditSheet } from '@components/sheet/jobsEditSheet';
import { Textarea } from '@components/textarea';
import { useNotes } from 'src/hooks/useNotes';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useToast } from '@components/toast/use-toast';
import { useRowDelete } from 'src/hooks/useDeleteModal';
import { AlertDialog } from '@components/alert-dialog';
import { cn } from 'src/utils';

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
            <div className="flex bg-white">
                <div className="flex-2 grow-0 border-r p-6 basis-2/3">
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
                                    <Button size="xs" onClick={_ => showEditSheet(job)} fillType="outlined" className="inline-block py-1">Edit</Button>
                                    {isRefetching && <Spinner />}
                                </div>
                                <ul className="flex gap-6 text-light-text list-disc">
                                    <li className="list-none"><Typography variant="body-md">{job.company_name}</Typography></li>
                                    {job.location && <li>{job.location}</li>}
                                    <li>{Status_Lookup[job.status]}</li>
                                </ul>
                            </div>
                            <Rating size="md" value={job.priority ?? 0} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Typography variant="body-sm"><a target="_blank" rel="noreferrer noopener" className="underline" href={job.link ?? ''}>{job.link}</a></Typography>
                            {job.created_at && <Typography variant="body-sm">Saved on {formatDate(job.created_at)}</Typography>}
                            {/* <Typography variant="body-md">{job.position}</Typography> */}
                        </div>
                    </header>

                    <main className="mb-6">
                        {/* <Typography variant="display-xs" className="mb-2">Description</Typography> */}
                        <section className="border border-gray-100 p-3">
                            <div className="text-base-col" id="__description" dangerouslySetInnerHTML={{ __html: job.description ?? '' }} />
                        </section>
                    </main>

                    <footer>
                        <JobLabels labels={job.labels ?? []} />
                    </footer>
                </div>
                <div className="flex-1 shrink-0 grow-0 basis-1/3 p-6 flex flex-col gap-3">
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

function NoteForm({ job }: { job: Job }) {
    const [note, setNote] = useState('')
    const { toast } = useToast()
    const client = useSupabaseClient<Database>();
    const queryClient = useQueryClient()

    // TODO: error handling
    const { mutateAsync, isLoading: isAddingNotes } = useMutation({
        mutationFn: async (data: NoteInsertDTO) => {
            const { error } = await client.from('notes').insert(data)
            if (error) throw error;
        },
        // TODO: might want to use query.setQueryData here too
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes', job.id] })
    })

    const canSubmit = note.trim();

    const handleCreateNote = async (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        if (!canSubmit) return;
        try {
            await mutateAsync({
                text: note,
                jobid: job.id,
                status: job.status
            })
            setNote('');
            toast({
                variant: 'default',
                title: 'Note added',
            })
        } catch (err) {
            alert('Error')
            // do I still need to do all the error things? Or does the react-query library do that for me?
        }
    }

    return (
        <form onSubmit={handleCreateNote} className="flex flex-col gap-4">
            <Textarea value={note} required onChange={val => setNote(val.target.value)} />
            <Button loading={isAddingNotes} disabled={!canSubmit}>Add notes</Button>
        </form>
    )
}

interface NoteListProps extends HTMLAttributes<HTMLElement> {
    job: Job
}

function NotesList({ job, ...rest }: NoteListProps) {
    const client = useSupabaseClient<Database>();
    const { data: notes, isLoading, refetch } = useNotes({ jobId: job.id })
    const {
        showDeleteDialog,
        isOpen: deleteModalOpen,
        onCancel,
        handleDelete,
        setIsOpen,
        loading: isDeleting
    } = useRowDelete<Note>({
        onDelete: async (id: string) => {
            const { error } = await client.from('notes').delete().eq('id', id)
            if (error) throw error;
        },
        refresh: async () => { await refetch() }
    })

    if (isLoading) return <Spinner />

    return (
        <>
            {/* {notes?.length && <hr className="border-0 border-b" />} */}
            <section {...rest} className={cn('flex flex-col', notes?.length && 'border rounded-md')}>
                {notes?.map((note, idx) => (
                    <article key={note.id} className={cn('p-3 cursor-pointer hover:bg-gray-100 group relative', idx + 1 !== notes.length && 'border-b')}>
                        <p className="leading-tight text-sm mb-2 max-w-[17em]">{note.text}</p>
                        <div className="flex justify-between">
                            {note.created_at && <p className="text-sm text-gray-400">{formatDate(note.created_at)}</p>}
                            <p className="text-sm text-gray-400">{Status_Lookup[note.status]}</p>
                        </div>
                        <button onClick={_ => showDeleteDialog(note)} className="hidden group-hover:block absolute top-3 right-3">
                            <Trash size={16} className="text-gray-700" />
                        </button>
                    </article>
                ))}

                <AlertDialog
                    open={deleteModalOpen}
                    title="Delete Confirmation"
                    description="Are you sure you want to delete this note?"
                    onOk={handleDelete}
                    onOpenChange={setIsOpen}
                    onCancel={onCancel}
                    isProcessing={isDeleting}
                />
            </section>
        </>
    )
}

const JobLabels = ({ labels }: { labels: string[] }) => {
    const variants = ['blue', 'purple', 'green', 'gold', 'orange']

    const getChipColors = (text: string) => {
        const index = djb2Hash(text, variants.length)
        return variants[index]
    }

    return (
        <div className="flex">
            {labels.map((label, index) => (
                <Chip key={index} label={label} variant={getChipColors(label) as ChipVariants} />
            ))}
        </div>
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