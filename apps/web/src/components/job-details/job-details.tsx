'use client'

import NoteForm from '@/components/notes/note-form';
import NotesList from '@/components/notes/note-list';
import { JobEditSheet } from '@/components/sheet/jobs-edit-sheet';
import { useJobs } from '@/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { type Job } from 'lib/types';
import { useEditSheet } from 'src/hooks/useEditModal';
import { CoverLetterSection } from './cover-letter-section';
import { JobDescription } from './description-body';
import { Header } from './header';
import { ResumeSection } from './resume-section';

export const JobDetails = ({ job }: { job: Job }) => {
    const { isOpen: editSheetOpen, showEditSheet, setIsOpen, selectedEntity } = useEditSheet({});
    const queryClient = useQueryClient()
    const { data } = useJobs({ initialData: [job], jobId: job.id })
    const jobDetails = data?.jobs[0];
    if (!jobDetails) return;

    const invalidateJobDetails = async () => {
        await queryClient.invalidateQueries({ queryKey: ['jobs'] })
        await queryClient.invalidateQueries({ queryKey: ['jobs', job.id] })
    }

    return (
        <>
            <div className="flex gap-4">
                <div className="flex-2 grow-0 basis-2/3">
                    <Header job={jobDetails} onEditClick={showEditSheet} />
                    <JobDescription job={jobDetails} />
                </div>
                <div className="flex-1 shrink-0 border-l grow-0 basis-1/3 p-6 flex flex-col gap-3 sticky top-0">
                    <ResumeSection job={jobDetails} />
                    <CoverLetterSection jobId={jobDetails.id} />
                    <section className="flex flex-col gap-2">
                        <h2>Notes</h2>
                        <NoteForm job={jobDetails} />
                        <NotesList job={jobDetails} />
                    </section>
                </div>
            </div>
            {editSheetOpen && (
                <JobEditSheet
                    onSuccess={invalidateJobDetails}
                    entity={selectedEntity}
                    open={editSheetOpen}
                    title="Edit Job"
                    onOpenChange={setIsOpen}
                />
            )}
        </>
    )
}

