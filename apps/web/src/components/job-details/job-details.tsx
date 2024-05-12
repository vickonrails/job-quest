'use client'

import NoteForm from '@/components/notes/note-form';
import NotesList from '@/components/notes/note-list';
import { JobEditSheet } from '@/components/sheet/jobs-edit-sheet';
import { type Job } from 'lib/types';
import { useEditSheet } from 'src/hooks/useEditModal';
import { CoverLetterSection } from './cover-letter-section';
import { JobDescription } from './description-body';
import { Header } from './header';
import { ResumeSection } from './resume-section';

export const JobDetails = ({ job }: { job: Job }) => {
    const { isOpen: editSheetOpen, showEditSheet, setIsOpen, selectedEntity } = useEditSheet({});
    if (!job) return;

    return (
        <>
            <div className="flex bg-white gap-4">
                <div className="flex-2 grow-0 basis-2/3">
                    <Header job={job} onEditClick={showEditSheet} />
                    <JobDescription job={job} />
                </div>
                <div className="flex-1 shrink-0 border-l grow-0 basis-1/3 p-6 flex flex-col gap-3 sticky top-0">
                    <ResumeSection job={job} />
                    <CoverLetterSection job={job} />
                    <section className="flex flex-col gap-2">
                        <h2>Notes</h2>
                        <NoteForm job={job} />
                        <NotesList job={job} />
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

