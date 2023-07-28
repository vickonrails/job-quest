import { type Job } from 'lib/types';
import { type TableConfig } from '../Table';

export const Status_Lookup = [
    'Bookmarked',
    'Applying',
    'Applied',
    'Interviewing',
    'Rejected',
    'Negotiating',
    'Hired',
]

export const tableConfig: TableConfig<Job> = {
    columns: [
        {
            title: 'Job Position',
            columnType: 'text',
            key: 'position',
            value: (job) => ({ text: job.position }),
            width: 250
        },
        {
            title: 'Company',
            columnType: 'logoWithText',
            key: 'company_name',
            value: (job) => ({ text: job.company_name, src: job.company_site && `https://logo.clearbit.com/${job.company_site}` }),
            width: 200
        },
        {
            title: 'Location',
            columnType: 'text',
            key: 'location',
            value: (job) => ({ text: job.location }),
            width: 200
        },
        {
            title: 'Priority',
            columnType: 'rating',
            key: 'priority',
            value: (job) => ({ rating: job.priority }),
            width: 200
        },
        {
            title: 'Status',
            columnType: 'text',
            key: 'status',
            value: (job) => ({ text: Status_Lookup[job.status] }),
            width: 150
        },
        {
            title: 'Date Added',
            columnType: 'date',
            key: 'created_at',
            value: (job) => ({ date: job.created_at }),
            width: 150
        },
        {
            title: 'Labels',
            columnType: 'chips',
            key: 'labels',
            value: (job) => ({ labels: job.labels }),
            width: 200
        },
    ]
}