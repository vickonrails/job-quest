import { type QueryParams, type Sort, type SortDirection } from '@hooks'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { cn } from '@utils/cn'
import { type Database } from 'lib/database.types'
import { type Job } from 'lib/types'
import { useRouter } from 'next/router'
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

interface SortOption {
    label: string
    value: string
    direction: SortDirection
}

const SORT_OPTIONS: SortOption[] = [
    { label: 'Newest First', value: 'created_at', direction: 'desc' },
    { label: 'Highest Priority', value: 'priority', direction: 'desc' },
    { label: 'Highest Status', value: 'status', direction: 'desc' },
]

interface JobsTableProps {
    jobs: Job[]
    queryParams: QueryParams
    setFilterParams: (params: QueryParams) => void
    count?: number
    isRefetching?: boolean
}

// TODO: I want the filtering to work in a very simple way - Just provide sorting buttons on the head of the table columns. Once clicked, it'll sort descending, clicking again will sort ascending and clicking again will remove the sort.
// Then for filtering, I want to have a button that will add selects to the top of the table. These selects will be for the available filtering and will control them.
const JobsTable = ({ jobs, setFilterParams, queryParams, count, isRefetching }: JobsTableProps) => {
    const client = useSupabaseClient<Database>();
    const router = useRouter();

    const onDelete = async (jobId: string) => {
        const { error } = await client.from('jobs').delete().eq('id', jobId);
        if (error) { throw error }
    }

    const onSortValueChange = (val: string) => {
        const option = SORT_OPTIONS.find(option => option.value === val)
        if (!option) return;

        const orderBy: Sort = { direction: option.direction, field: String(option.value) }
        setFilterParams({ ...queryParams, orderBy })
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
                <div className="flex gap-5 items-center">
                    <div className="flex gap-3 items-center">
                        <span>
                            Sort:
                        </span>
                        <Select
                            size="sm"
                            defaultValue={String(queryParams.orderBy?.field)}
                            options={SORT_OPTIONS}
                            onValueChange={onSortValueChange}
                        />
                    </div>
                </div>
            </section>
            <div className={cn(isRefetching && 'opacity-60 pointer-events-none')}>
                <Table<Job>
                    columns={columns}
                    data={jobs}
                    actions={actions}
                />
                <Pagination
                    totalCount={count}
                    count={jobs.length}
                    setFilterParams={setFilterParams}
                    queryParams={queryParams}
                />
            </div>
        </section >
    )
}

const PAGINATION_OPTIONS: SelectOption[] = [
    {
        value: 10,
        label: '10 rows'
    },
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
    queryParams: QueryParams
    setFilterParams: (params: QueryParams) => void
    setLimit?: (offset: number) => void
}

// TODO: move to another file
function Pagination({ totalCount, count, queryParams, setFilterParams }: PaginationProps) {
    const { limit, offset } = queryParams
    if (!limit) return null;

    const isLastPage = ((offset + 1) + limit >= (totalCount ?? 0))
    const isFirstPage = offset === 0;
    const totalPages = Math.ceil((totalCount ?? 0) / limit)
    const currentPage = Math.ceil((offset + 1) / limit)

    const next = () => {
        if (isLastPage) return
        setFilterParams?.({ offset: offset + limit, limit })
    }

    const prev = () => {
        if (isFirstPage) return;
        if (offset - limit < 0) {
            setFilterParams?.({ offset: 0, limit })
            return;
        }
        setFilterParams?.({ offset: offset - limit, limit })
    }

    return (
        <div className="flex items-center gap-1 my-4">
            <div className="flex gap-2">
                <button onClick={prev} disabled={isFirstPage} className={cn(isFirstPage && 'cursor-not-allowed text-gray-300')}><ChevronLeft /></button>
                <Select size="sm" options={PAGINATION_OPTIONS} defaultValue={String(limit)} onValueChange={val => setFilterParams?.({ limit: Number.parseInt(val), offset })} />
                <button onClick={next} disabled={isLastPage}><ChevronRight className={cn(isLastPage && 'cursor-not-allowed text-gray-300')} /></button>
            </div>

            {totalCount && <p className="text-sm">{currentPage} of {totalPages} pages | </p>}
            {count && <p className="text-sm">{count} records</p>}
        </div>
    )
}

export default JobsTable
