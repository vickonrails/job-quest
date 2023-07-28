import React from 'react'
import { Table } from '../Table'
import { tableConfig } from './JobsTableConfig'
import { useJobs } from '@hooks'
import { FullPageSpinner } from '@components/spinner'
import { type Database } from 'lib/database.types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

// TODO: For reference
// enum Status {
//     BOOKMARKED,
//     APPLYING,
//     APPLIED,
//     INTERVIEWING,
//     REJECTED,
//     NEGOTIATING,
//     HIRED
// }

const JobsTable = () => {
    const { loading, jobs, refreshing, refresh } = useJobs();
    const client = useSupabaseClient<Database>();
    const { columns } = tableConfig
    const router = useRouter();

    const onDelete = async (jobId: string) => {
        const { error } = await client.from('jobs').delete().eq('id', jobId);
        if (error) { throw error }
    }

    const onEdit = (id: string) => {
        router.push(`/app/tracker/jobs/${id}`).then(() => {
            // 
        }).catch(err => {
            // 
        })
    }

    const actions = {
        onDelete,
        onEdit,
        refresh
    }

    if (loading) { return <FullPageSpinner /> }

    return (
        <Table
            columns={columns}
            data={jobs}
            actions={actions}
            disabled={refreshing}
        />
    )
}

export default JobsTable
