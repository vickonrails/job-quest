'use client'

import { Table, type Column } from '@/components/table';
import { useToast } from '@/components/toast/use-toast';
import { JobsImportContent } from '@/components/upload/jobs-import';
import { UploadCard, type SupportedFormats } from '@/components/upload/upload-card';
import { createClient } from '@/utils/supabase/client';
import { type Job } from 'lib/types';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Status_Lookup } from 'shared';
import { Button } from 'ui/button';
import { type JobImportColumns } from './api/route';

const columns: Column<JobImportColumns> = [
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
    const [isImporting, setIsImporting] = useState(false)
    const [jobs, setJobs] = useState<JobImportColumns[]>([])
    const { toast } = useToast()
    const router = useRouter()

    const handleImport = async () => {
        try {
            setIsImporting(true)
            const client = createClient()
            const { data, error } = await client.from('jobs').insert(jobs as Job[]).select()
            if (error || !data) throw error
            toast({
                title: 'Success',
                description: 'Jobs imported successfully'
            })
            router.push('/jobs-tracker')
        } catch (err) {
            toast({
                title: 'Error',
                description: 'There was an error in one or more columns'
            })
        } finally {
            setIsImporting(false)
        }
    }

    if (jobs.length > 0) {
        return (
            <section className="mt-10 p-6">
                <header className="flex">
                    <h1 className="my-4 font-bold uppercase flex-1">Importing {jobs.length} jobs</h1>
                    <Button
                        loadingContent="Importing"
                        loading={isImporting}
                        onClick={handleImport}
                    >
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
