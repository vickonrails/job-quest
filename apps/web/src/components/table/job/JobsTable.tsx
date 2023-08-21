import React from 'react'
import { type EditJobFormProps, Table, type TableActions, type Column } from '../Table'
import { useJobs } from '@hooks'
import { FullPageSpinner } from '@components/spinner'
import { type Database } from 'lib/database.types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { type Job } from 'lib/types'
import { useAuth } from 'src/hooks/useAuth'

export const Status_Lookup = [
    'Bookmarked',
    'Applying',
    'Applied',
    'Interviewing',
    'Rejected',
    'Negotiating',
    'Hired',
]

export const columns: Column<Job> = [
    { header: 'Company Name', type: 'logoWithText', renderValue: (item) => ({ src: item.company_site ? `https://logo.clearbit.com/${item.company_site}` : '', text: item.company_name }) },
    { header: 'Position', type: 'text', renderValue: (item) => ({ text: item.position }) },
    { header: 'Status', type: 'text', renderValue: (item) => ({ text: Status_Lookup[item.status] ?? '' }) },
    { header: 'Rating', type: 'rating', renderValue: (item) => ({ rating: item.priority ?? 0 }) },
    { header: 'Date', type: 'date', renderValue: (item) => ({ date: item.created_at ?? '' }) },
]

const JobsTable = () => {
    const client = useSupabaseClient<Database>();
    const { data, isLoading } = useJobs();
    const router = useRouter();

    const onDelete = async (jobId: string) => {
        const { error } = await client.from('jobs').delete().eq('id', jobId);
        if (error) { throw error }
    }

    const onEditClick = (id: string) => {
        // setDetailOpen(true)
        // router.push(`/app/tracker/jobs/${id}/edit`).then(() => {
        //     // 
        // }).catch(err => {
        //     // 
        // })
    }

    const onRowClick = (id: string) => {
        router.push(`/jobs/${id}`).then(() => {
            // 
        }).catch(err => {
            // 
        })
    }

    const actions: TableActions = {
        onDelete,
        // onEditClick,
        onRowClick,
        // refresh: refetch
    }

    if (isLoading) { return <FullPageSpinner /> }

    return (
        <Table<Job>
            columns={columns}
            data={data ?? []}
            actions={actions}
            EditForm={EditJobForm}
        />
    )
}


// TODO: Take this off
const EditJobForm = (props: EditJobFormProps<Job>) => {
    return (
        <h1>TODO</h1>
    )
}

export default JobsTable
