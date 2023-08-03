import React, { useState } from 'react'
import { Table, TableActions } from '../Table'
import { columns } from './JobsTableConfig'
import { useJobs } from '@hooks'
import { FullPageSpinner } from '@components/spinner'
import { type Database } from 'lib/database.types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { AlertDialog } from '@components/alert-dialog'

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

    const router = useRouter();

    const onDelete = async (jobId: string) => {
        const { error } = await client.from('jobs').delete().eq('id', jobId);
        if (error) { throw error }
    }

    const onEditClick = (id: string) => {
        // 
    }

    const onRowClick = (id: string) => {
        router.push(`/app/tracker/jobs/${id}`).then(() => {
            // 
        }).catch(err => {
            // 
        })
    }

    const actions: TableActions = {
        onDelete,
        onEditClick,
        refresh,
        onRowClick
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
