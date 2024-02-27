import { Typography } from '@components/typography'
import { type Column } from './Table'

export function TableHeader<T>({ columns, hideActions }: { columns: Column<T>, hideActions?: boolean }) {
    return (
        <thead className="rounded-sm bg-gray-50 sticky top-0 border-t">
            <tr>
                {!hideActions && (
                    <th className="px-4 py-2 text-left rounded-tl-lg bg-white border-b border-x">
                        <Typography variant="body-sm" className="font-normal text-accent">Actions</Typography>
                    </th>
                )}
                {columns.map(col => (
                    <th className="px-4 py-2 text-left border-b border-x" key={col.header}>
                        <Typography variant="body-sm" className="font-medium text-accent-foreground">{col.header}</Typography>
                    </th>
                ))}
            </tr>
        </ thead>
    )
}