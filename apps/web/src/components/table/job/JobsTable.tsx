import React, { useState } from 'react'
import { Table, type TableActions, type Column } from '../Table'
import { useJobs } from '@hooks'
import { FullPageSpinner, Spinner } from '@components/spinner'
import { type Database } from 'lib/database.types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { type Job } from 'lib/types'
import { Filter, Layout, Grid, ChevronLeft, ChevronRight } from 'react-feather'
import { Select, type SelectOption } from '@components/select/select'
import { cn } from '@utils/cn'

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

const SIZE_LIMIT = 10

const SORT_OPTIONS: SelectOption[] = [
    { label: 'Newest', value: 'created_at' },
    { label: 'Highest Priority', value: 'priority' },
    { label: 'Highest Status', value: 'status' }
]

// TODO: I want the filtering to work in a very simple way - Just provide sorting buttons on the head of the table columns. Once clicked, it'll sort descending, clicking again will sort ascending and clicking again will remove the sort.
// Then for filtering, I want to have a button that will add selects to the top of the table. These selects will be for the available filtering and will control them.
const JobsTable = () => {
    const client = useSupabaseClient<Database>();
    const [sizeLimit, setSizeLimit] = useState(SIZE_LIMIT)
    // TODO: put the sorting and pagination capabilities inside the useJobs hook
    const [offset, setOffset] = useState<number>(0)
    const [sort, setSort] = useState(SORT_OPTIONS[0])
    const { data, isLoading, isRefetching } = useJobs({ params: { offset, limit: sizeLimit, orderBy: { field: sort?.value as string, direction: 'desc' } } });
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

    return (
        <section>
            <section className="flex justify-between mb-4">
                <button className="flex gap-1 items-center">
                    <div className="border-2 rounded-md p-1 border-gray-500">
                        <Filter size={18} />
                    </div>

                    <span className="text-gray-600">Filter</span>
                    {isRefetching && <Spinner />}
                </button>

                <div className="flex gap-5 items-center">
                    <div className="flex gap-3 items-center">
                        <span>
                            Sort:
                        </span>
                        <Select size="sm" defaultValue={String(sort?.value)} options={SORT_OPTIONS} onValueChange={val => setSort(SORT_OPTIONS.find(x => x.value === val))} />
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
            {isLoading ? <FullPageSpinner /> : (
                <>
                    <Table<Job>
                        columns={columns}
                        data={data?.jobs ?? []}
                        actions={actions}
                    />
                    <Pagination
                        totalCount={data?.count}
                        count={data?.jobs.length}
                        setLimit={(val) => setSizeLimit(val)}
                        limit={sizeLimit}
                        offset={offset}
                        setOffset={setOffset}
                    />
                </>
            )}
        </section >
    )
}

const PAGINATION_OPTIONS: SelectOption[] = [
    {
        value: 5,
        label: '5 rows'
    },
    {
        value: 10,
        label: '10 rows'
    },
    {
        value: 50,
        label: '50 rows'
    }
]

interface PaginationProps {
    totalCount?: number
    count?: number
    offset: number
    limit: number
    setLimit?: (offset: number) => void
    setOffset: (offset: number) => void
}

function Pagination({ totalCount, count, offset, setOffset, setLimit, limit }: PaginationProps) {
    const isLastPage = ((offset + 1) + limit >= (totalCount ?? 0))
    const isFirstPage = offset === 0;
    const totalPages = Math.ceil((totalCount ?? 0) / limit)
    const currentPage = Math.ceil((offset + 1) / limit)

    const next = () => {
        if (isLastPage) return
        setOffset?.(offset + limit)
    }

    const prev = () => {
        if (isFirstPage) return;
        if (offset - limit < 0) {
            setOffset(0)
            return;
        }
        setOffset?.(offset - limit)
    }

    return (
        <div className="flex items-center gap-1">
            <div className="flex gap-2">
                <button onClick={prev} disabled={isFirstPage} className={cn(isFirstPage && 'cursor-not-allowed text-gray-300')}><ChevronLeft /></button>
                <Select size="sm" options={PAGINATION_OPTIONS} trigger="5" defaultValue={String(limit)} onValueChange={val => setLimit?.(Number.parseInt(val))} />
                <button onClick={next} disabled={isLastPage}><ChevronRight className={cn(isLastPage && 'cursor-not-allowed text-gray-300')} /></button>
            </div>

            {totalCount && <p className="text-sm">{currentPage} of {totalPages} pages | </p>}
            {count && <p className="text-sm">{count} records</p>}
        </div>
    )
}

export default JobsTable
