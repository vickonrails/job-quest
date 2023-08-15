import React, { type HTMLAttributes, type JSX } from 'react'
import { TableHeader } from './TableHeader';

import { useWindowHeight } from 'src/hooks/useWindowHeight';
import { TableBody } from './TableBody';
import { type TableColumnType } from './TableCellRender';

export type TableActions = {
    onEditClick?: (id: string) => void
    onDelete: (id: string) => Promise<void>
    refresh: () => Promise<void>
    onRowClick: (id: string) => void
}
interface TableProps<T> extends HTMLAttributes<HTMLTableElement> {
    /** data to render */
    data: T[]
    /** actions to perform on table rows */
    actions: TableActions

    disabled?: boolean

    columns: Column<T>

    EditForm?: (props: EditJobFormProps<T>) => JSX.Element
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
export function Table<T extends BaseEntity,>({ columns, data, actions, ...rest }: TableProps<T>) {
    const windowHeight = useWindowHeight()
    return (
        <div style={{ maxHeight: windowHeight - 190, overflow: 'auto', position: 'relative' }} {...rest}>
            <table className="w-full">
                <TableHeader<T> columns={columns} />
                <TableBody<T> items={data} columns={columns} actions={actions} />
            </table>
        </div>
    )
}

export type EditJobFormProps<T> = HTMLAttributes<HTMLFormElement> & { entity?: T }