import { type HTMLAttributes } from 'react';
import { TableHeader } from './TableHeader';

import { useWindowHeight } from 'src/hooks/useWindowHeight';
import { TableBody } from './TableBody';
import { type TableColumnType } from './TableCellRender';

export type TableActions = {
    onEditClick?: (id: string) => void
    onDelete?: (id: string) => Promise<void>
    refresh?: () => Promise<void>
    onRowClick?: (id: string) => void
}
// TODO: handle table empty state with no data
interface TableProps<T> extends HTMLAttributes<HTMLTableElement> {
    /** data to render */
    data: T[]
    /** actions to perform on table rows */
    actions: TableActions
    hideActions?: boolean

    disabled?: boolean

    columns: Column<T>
}

export type BaseEntity = { id: string }

// TODO: Virtualized lists
// TODO: Format dates properly

type ColumnDef<T> = {
    header: string,
    key?: string,
    type: TableColumnType,
    renderValue?: (item: T) => ({ [key: string]: string | number })
}

export type Column<T> = ColumnDef<T>[]

/**
 * Table Component
 */
export function Table<T extends BaseEntity,>({ columns, data, actions, hideActions, ...rest }: TableProps<T>) {
    const windowHeight = useWindowHeight()
    return (
        <div
            style={{ maxHeight: windowHeight - 280, overflow: 'auto', position: 'relative' }}
            className="border-t border-b"
            {...rest}
        >
            <table className="w-full rounded-lg">
                <TableHeader<T> columns={columns} hideActions={hideActions} />
                <TableBody<T> items={data} columns={columns} actions={actions} hideActions={hideActions} />
            </table>
        </div>
    )
}

export type EditJobFormProps<T> = HTMLAttributes<HTMLFormElement> & { entity?: T }