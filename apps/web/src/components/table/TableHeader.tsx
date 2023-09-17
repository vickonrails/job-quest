import { Typography } from '@components/typography'
import { type Column } from './Table'

export function TableHeader<T>({ columns, hideActions }: { columns: Column<T>, hideActions?: boolean }) {
    return (
        <thead className="rounded-sm bg-white sticky top-0 shadow-sm" >
            <tr className="border-b">
                {!hideActions && (
                    <th className="px-4 py-3 text-left rounded-tl-lg bg-white border">
                        <Typography variant="body-sm" className="text-light-text font-normal">Actions</Typography>
                    </th>
                )}
                {columns.map(col => (
                    <th className="px-4 py-3 text-left border-b border-x" key={col.header}>
                        <Typography variant="body-sm" className="text-light-text font-normal">{col.header}</Typography>
                    </th>
                ))}
            </tr>
        </ thead>
    )
}