import { type Column } from './Table'

export function TableHeader<T>({ columns, hideActions }: { columns: Column<T>, hideActions?: boolean }) {
    return (
        <thead className="rounded-sm sticky -top-0.5 border-t bg-background">
            <tr>
                {!hideActions && (
                    <th className="px-4 py-2 text-left rounded-tl-lg border-b border-x">
                        <div className="font-normal text-accent">Actions</div>
                    </th>
                )}
                {columns.map(col => (
                    <th className="px-4 py-2 text-left border-b border-x" key={col.header}>
                        <div className="font-medium text-accent-foreground">{col.header}</div>
                    </th>
                ))}
            </tr>
        </ thead>
    )
}