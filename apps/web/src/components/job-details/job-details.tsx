import { Chip } from '@components/chips/Chip';
import NoteForm from '@components/notes/note-form';
import NotesList from '@components/notes/note-list';
import { JobEditSheet } from '@components/sheet/jobsEditSheet';
import { useToast } from '@components/toast/use-toast';
import { Typography } from '@components/typography';
import { formatDate } from '@components/utils';
import { type Job, type Note } from '@lib/types';
import { cn } from '@utils/cn';
import hashColors from '@utils/hash-colors';
import { ExternalLink, Wand2 } from 'lucide-react';
import { useEditSheet } from 'src/hooks/useEditModal';
import { useJobKeywords } from 'src/hooks/useJobKeywords';
import { Button, Rating, Status_Lookup } from 'ui';
import { CoverLetterSection } from './cover-letter-section';
import { ResumeSection } from './resume-section';

export const JobDetails = ({ job, notes }: { job: Job, notes: Note[] }) => {
    const { isOpen: editSheetOpen, showEditSheet, setIsOpen, selectedEntity } = useEditSheet({});
    const { loading, generateKeywords } = useJobKeywords(job)
    const { toast } = useToast()

    if (!job) return;

    const status = Status_Lookup.find((x, idx) => idx === job.status)
    const handleGenerateClick = async () => {
        try {
            await generateKeywords({ description: job.description ?? '' });
        } catch {
            toast({
                variant: 'destructive',
                title: 'Failed to generate keywords',
            })
        }
    }

    return (
        <>
            <div className="flex bg-white gap-4">
                <div className="flex-2 grow-0 basis-2/3">
                    <header className="mb-4">
                        <div className="flex items-start mb-4">
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

                        <section className="p-4 border flex flex-col items-start gap-2">
                            <div>
                                <h3 className="font-medium">Relevant Keywords</h3>
                                <p className="text-muted-foreground">Certain keywords, when added to your resume & cover letter can help your application rank higher in automated systems like ATS (Applicant Tracking Systems).</p>
                            </div>
                            {job.keywords ? <Keywords keywords={job.keywords} /> : (
                                <Button
                                    variant="outline"
                                    className="gap-2 items-center"
                                    onClick={handleGenerateClick}
                                    loading={loading}
                                >
                                    <Wand2 size={18} />
                                    <span>Generate Keywords</span>
                                </Button>
                            )}
                        </section>
                    </header>

                    <main className="mb-6">
                        <section className="border p-3 rounded-md">
                            <div className="text-base-col" id="__description" dangerouslySetInnerHTML={{ __html: job.description ?? '' }} />
                        </section>
                    </main>
                </div>
                <div className="flex-1 shrink-0 border-l grow-0 basis-1/3 p-6 flex flex-col gap-3 sticky top-0">
                    <ResumeSection job={job} />
                    <CoverLetterSection job={job} />
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

function Keywords({ keywords }: { keywords: string[] }) {
    return (
        <ul>
            {keywords.map((keyword, idx) => (<Chip key={`${keyword}-${idx}`} label={keyword} />))}
        </ul>
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
