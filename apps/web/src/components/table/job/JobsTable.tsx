import React from 'react'
import { Table, type TableActions, type Column } from '../Table'
import { useJobs } from '@hooks'
import { FullPageSpinner } from '@components/spinner'
import { type Database } from 'lib/database.types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { type Job } from 'lib/types'
import { Filter, Layout, Grid } from 'react-feather'

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
    { header: 'Position', type: 'text', renderValue: (item) => ({ text: item.position }) },
    { header: 'Company Name', type: 'logoWithText', renderValue: (item) => ({ src: item.company_site ? `https://logo.clearbit.com/${item.company_site}` : '', text: item.company_name }) },
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

    const onRowClick = (id: string) => {
        router.push(`/jobs/${id}`).then(() => {
            // 
        }).catch(err => {
            // 
        })
    }

    const actions: TableActions = {
        onDelete,
        onRowClick,
    }

    if (isLoading) { return <FullPageSpinner /> }

    return (
        <section>
            <section className="flex justify-between mb-4">
                <button className="flex gap-1 items-center">
                    <div className="border-2 rounded-md p-1 border-gray-500">
                        <Filter size={18} />
                    </div>

                    <span className="text-gray-600">Filter</span>
                </button>

                <div className="flex gap-5 items-center">
                    <div className="flex gap-3 items-center">
                        <span>
                            Sort:
                        </span>
                        <select>
                            <option>Priority</option>
                            <option>Date</option>
                            <option>Status</option>
                        </select>
                    </div>

                    <div className="flex gap-2 text-gray-500">
                        <button>
                            <Layout />
                        </button>
                        <button>
                            <Grid />
                        </button>
                    </div>
                </div>
            </section>
            <Table<Job>
                columns={columns}
                data={data ?? []}
                actions={actions}
            />
        </section >
    )
}

export default JobsTable
