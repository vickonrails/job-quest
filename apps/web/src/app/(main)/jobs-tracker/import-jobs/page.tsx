'use client'

import { Table, type Column } from '@/components/table';
import { JobsImportContent } from '@/components/upload/jobs-import';
import { UploadCard, type SupportedFormats } from '@/components/upload/upload-card';
import { type Job } from 'lib/types';
import { useState } from 'react';
import { Status_Lookup } from 'shared';
import { Button } from 'ui/button';
import { type JobImportColumns } from './api/route';
import { ChevronRight } from 'lucide-react';

export const columns: Column<JobImportColumns> = [
    { header: 'Position', type: 'text', renderValue: (item) => ({ text: item.position }) },
    { header: 'Company Name', type: 'logoWithText', renderValue: (item) => ({ text: item.company_name }) },
    {
        header: 'Status', type: 'text', renderValue: (item) => {
            const status = Status_Lookup.find((x, idx) => idx === Number(item.status))
            return { text: status ?? '' }
        }
    },
    { header: 'Rating', type: 'rating', renderValue: (item) => ({ rating: Number(item.priority) ?? 0 }) },
]

const supportedFormats: SupportedFormats[] = ['xlsx', 'xls']

export default function ImportJobs() {
    const [jobs, setJobs] = useState<JobImportColumns[]>([
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
        { position: 'Software Engineer', company_name: 'Google', status: 1, priority: 5, link: '', location: '', description: '' },
    ])

    if (jobs.length > 0) {
        return (
            <section className="mt-10 p-6">
                <header className="flex">
                    <h1 className="my-4 font-bold uppercase flex-1">Importing {jobs.length} jobs</h1>
                    <Button>
                        <span>Proceed</span>
                        <ChevronRight size={18} />
                    </Button>
                </header>
                <Table<Job>
                    columns={columns}
                    data={jobs as Job[]}
                    hideActions
                />
            </section>
        )
    }

    return (
        <section className="max-w-xl mx-auto mt-20 w-full">
            <UploadCard
                Content={(
                    <JobsImportContent
                        jobs={jobs}
                        setJobs={setJobs}
                        supportedFormats={supportedFormats} />
                )}
                title="Import jobs"
                supportedFormats={supportedFormats}
                maxSize={12}
            />
        </section>
    )
}
