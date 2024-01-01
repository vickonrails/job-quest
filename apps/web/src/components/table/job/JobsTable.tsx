import { FullPageSpinner } from '@components/spinner'
import { useJobs } from '@hooks'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { cn } from '@utils/cn'
import { type Database } from 'lib/database.types'
import { type Job } from 'lib/types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { Select, Status_Lookup, type SelectOption } from 'ui'
import { Table, type Column, type TableActions } from '../Table'

export const columns: Column<Job> = [
    { header: 'Position', type: 'text', renderValue: (item) => ({ text: item.position }) },
    { header: 'Company Name', type: 'logoWithText', renderValue: (item) => ({ src: item.company_site ? `https://logo.clearbit.com/${item.company_site}` : '', text: item.company_name }) },
    { header: 'Status', type: 'text', renderValue: (item) => ({ text: Status_Lookup[item.status] ?? '' }) },
    { header: 'Rating', type: 'rating', renderValue: (item) => ({ rating: item.priority ?? 0 }) },
    { header: 'Date', type: 'date', renderValue: (item) => ({ date: item.created_at ?? '' }) },
]

const SIZE_LIMIT = 50

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
    const [sort, setSort] = useState<SelectOption>(SORT_OPTIONS[0]!)
    const { data, isLoading } = useJobs({ params: { offset, limit: sizeLimit, orderBy: { field: sort?.value as string, direction: 'desc' } } });
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
        onRowClick
    }

    return (
        <section>
            <section className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">All Jobs</h3>
                <div className="flex gap-5 items-center">
                    <div className="flex gap-3 items-center">
                        <span>
                            Sort:
                        </span>
                        <Select size="sm" defaultValue={String(sort?.value)} options={SORT_OPTIONS} onValueChange={val => setSort(SORT_OPTIONS.find(x => x.value === val)!)} />
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
        value: 50,
        label: '50 rows'
    },
    {
        value: 100,
        label: '100 rows'
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

// TODO: move to another file
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
        <div className="flex items-center gap-1 mt-4">
            <div className="flex gap-2">
                <button onClick={prev} disabled={isFirstPage} className={cn(isFirstPage && 'cursor-not-allowed text-gray-300')}><ChevronLeft /></button>
                <Select size="sm" options={PAGINATION_OPTIONS} defaultValue={String(limit)} onValueChange={val => setLimit?.(Number.parseInt(val))} />
                <button onClick={next} disabled={isLastPage}><ChevronRight className={cn(isLastPage && 'cursor-not-allowed text-gray-300')} /></button>
            </div>

            {totalCount && <p className="text-sm">{currentPage} of {totalPages} pages | </p>}
            {count && <p className="text-sm">{count} records</p>}
        </div>
    )
}

export default JobsTable
