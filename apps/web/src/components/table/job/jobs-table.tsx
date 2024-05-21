'use client'

import { type Job } from 'lib/types'
import { useRouter } from 'next/navigation'
import { Status_Lookup } from 'shared'
import { Table, type Column, type TableActions } from '../Table'
import { createClient } from '@/utils/supabase/client'

export const columns: Column<Job> = [
    { header: 'Position', type: 'text', renderValue: (item) => ({ text: item.position }) },
    { header: 'Company Name', type: 'logoWithText', renderValue: (item) => ({ src: item.company_site ? `https://logo.clearbit.com/${item.company_site}` : '', text: item.company_name }) },
    {
        header: 'Status', type: 'text', renderValue: (item) => {
            const status = Status_Lookup.find((x, idx) => idx === item.status)
            return { text: status ?? '' }
        }
    },
    { header: 'Rating', type: 'rating', renderValue: (item) => ({ rating: item.priority ?? 0 }) },
    { header: 'Date', type: 'date', renderValue: (item) => ({ date: item.created_at ?? '' }) },
]

// TODO: I want the filtering to work in a very simple way - Just provide sorting buttons on the head of the table columns. Once clicked, it'll sort descending, clicking again will sort ascending and clicking again will remove the sort.
// Then for filtering, I want to have a button that will add selects to the top of the table. These selects will be for the available filtering and will control them.
const JobsTable = ({ jobs, hideActions }: { jobs: Job[], hideActions?: boolean }) => {
    const client = createClient();
    const router = useRouter();

    const onDelete = async (jobId: string) => {
        const { error } = await client.from('jobs').delete().eq('id', jobId);
        if (error) { throw error }
    }

    const onRowClick = (id: string) => {
        router.push(`/jobs-tracker/${id}`)
    }

    const actions: TableActions = {
        onDelete,
        onRowClick
    }

    return (
        <Table<Job>
            columns={columns}
            data={jobs}
            actions={actions}
            hideActions={hideActions}
        />
    )
}

export default JobsTable