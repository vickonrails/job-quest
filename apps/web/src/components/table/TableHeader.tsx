import { Typography } from 'ui'
import { type Column } from './Table'

export function TableHeader<T>({ columns }: { columns: Column<T> }) {
    return (
        <thead className="sticky top-0 border-b-2 rounded-sm bg-white">
            <tr>
                <th className="border-b-2 p-4 text-left">
                    <Typography variant="body-sm" className="text-light-text font-normal">Actions</Typography>
                </th>
                {columns.map(col => (
                    <th className="border-b-2 p-4 text-left" key={col.header}>
                        <Typography variant="body-sm" className="text-light-text font-normal">{col.header}</Typography>
                    </th>
                ))}
            </tr>
        </thead>
    )
}