import { type Job } from 'lib/types';
// import { type TableConfig } from '../Table';
import { type ColumnDef } from '@tanstack/react-table'

export const Status_Lookup = [
    'Bookmarked',
    'Applying',
    'Applied',
    'Interviewing',
    'Rejected',
    'Negotiating',
    'Hired',
]

export const columns: ColumnDef<Job>[] = [
    {
        accessorFn: (job) => ({ type: 'text', value: { text: job.position } }),
        header: 'Position',
        size: 300
    },
    {
        accessorFn: (job) => ({ type: 'logoWithText', value: { text: job.company_name, src: job.company_site && `https://logo.clearbit.com/${job.company_site}` } }),
        header: 'Company',
        size: 200
    },
    {
        accessorFn: (job) => ({ type: 'text', value: { text: job.location } }),
        header: 'Location',
        size: 150
    },
    {
        accessorFn: (job) => ({ type: 'rating', value: { rating: job.priority } }),
        header: 'Priority',
        size: 150,
    },
    {
        accessorFn: (job) => ({ type: 'text', value: { text: Status_Lookup[job.status] } }),
        header: 'Status',
        size: 100
    },
    {
        accessorFn: (job) => ({ type: 'date', value: { date: job.created_at } }),
        header: 'Date Added',
        size: 150
    },
    {
        accessorFn: (job) => ({ type: 'chips', value: { labels: job.labels } }),
        header: 'Labels',
        size: 200
    },
]