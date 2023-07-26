import React from 'react'
import { Table, type TableConfig } from './Table'
import { type Job } from 'lib/types'

enum Status {
    BOOKMARKED,
    APPLYING,
    APPLIED,
    INTERVIEWING,
    REJECTED,
    NEGOTIATING,
    HIRED
}

export const Status_Lookup = [
    'Bookmarked',
    'Applying',
    'Applied',
    'Interviewing',
    'Rejected',
    'Negotiating',
    'Hired',
]

const tableConfig: TableConfig = {
    columns: [
        {
            title: 'Job Position',
            columnType: 'text',
            key: 'position',
            value: (job: Job) => ({ text: job.position }),
            width: 250
        },
        {
            title: 'Company',
            columnType: 'logoWithText',
            key: 'company_name',
            value: (job: Job) => ({ text: job.company_name, src: job.company_site && `https://logo.clearbit.com/${job.company_site}` }),
            width: 200
        },
        {
            title: 'Location',
            columnType: 'text',
            key: 'location',
            value: (job: Job) => ({ text: job.location }),
            width: 200
        },
        {
            title: 'Priority',
            columnType: 'rating',
            key: 'priority',
            value: (job: Job) => ({ rating: job.priority }),
            width: 200
        },
        {
            title: 'Status',
            columnType: 'text',
            key: 'status',
            value: (job: Job) => ({ text: Status_Lookup[job.status] }),
            width: 150
        },
        {
            title: 'Date Added',
            columnType: 'date',
            key: 'created_at',
            value: (job: Job) => ({ date: job.created_at }),
            width: 150
        },
        {
            title: 'Labels',
            columnType: 'chips',
            key: 'labels',
            value: (job: Job) => ({ labels: job.labels }),
            width: 200
        },
    ]
}

const JobsTable = ({ jobs }: { jobs: Job[] }) => {

    return (
        <Table
            columns={tableConfig.columns}
            data={jobs}
        />
    )
}

export default JobsTable
