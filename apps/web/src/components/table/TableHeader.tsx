import { Typography } from '@components/typography'
import { type Column } from './Table'

export function TableHeader<T>({ columns, hideActions }: { columns: Column<T>, hideActions?: boolean }) {
    return (
        <thead className="sticky top-0 border-b-2 rounded-sm bg-white">
            <tr>
                {!hideActions && (
                    <th className="border-b-2 p-4 py-5 text-left rounded-tl-lg bg-white">
                        <Typography variant="body-sm" className="text-light-text font-normal">Actions</Typography>
                    </th>
                )}
                {columns.map(col => (
                    <th className="border-b-2 p-4 py-5 text-left" key={col.header}>
                        <Typography variant="body-sm" className="text-light-text font-normal">{col.header}</Typography>
                    </th>
                ))}
            </tr>
        </thead>
    )
}