import { cn } from '@utils/cn'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Select, type SelectOption } from 'ui'

interface PaginationProps {
    totalCount?: number
    count?: number
    offset: number
    limit: number
    setLimit?: (offset: number) => void
    setOffset: (offset: number) => void
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
