import React from 'react'
import { CellRendererProps, Table, TableCellRender, type TableConfig } from './Table'
import { type Job } from 'lib/types'
import { Typography } from 'ui'

const tableConfig: TableConfig = {
    columns: [
        {
            title: 'Job Position',
            columnType: 'text',
            key: 'position',
            value: (job: Job) => ({ text: job.position })
        },
        {
            title: 'Company',
            columnType: 'logoWithText',
            key: 'company_name',
            value: (job: Job) => ({ text: job.company_name, src: job.company_site && `https://logo.clearbit.com/${job.company_site}` })
        },
        {
            title: 'Location',
            columnType: 'text',
            key: 'location',
            value: (job: Job) => ({ text: job.location })
        },
        {
            title: 'Priority',
            columnType: 'rating',
            key: 'priority',
            value: (job: Job) => ({ value: job.position })
        },
        {
            title: 'Status',
            columnType: 'text',
            key: 'status',
            value: (job: Job) => ({ text: job.status })
        },
        {
            title: 'Date Added',
            columnType: 'date',
            key: 'created_at',
            value: (job: Job) => ({ date: job.created_at })
        },
        {
            title: 'Labels',
            columnType: 'chips',
            key: 'labels',
            value: (job: Job) => ({ value: job.position })
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

{/* {tableConfig.columns.map((col, idx) => (
                <TableCellRender<Job> key={idx} type={col.columnType} value={row} />
            ))}
        </Table> */}