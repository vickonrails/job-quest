import React, { type JSX, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Edit, Trash2, MoreVertical } from 'react-feather';
import { type CellRendererProps, TableCellRender, type TableColumnType, type TableCellValue, CellValueTypes } from './TableCellRender';
import { TableHeader } from './TableHeader';
import { MenuBar, MenuItem, Separator } from '@components/menubar'

import { useReactTable, flexRender, type ColumnDef, getCoreRowModel, type Row, getSortedRowModel } from '@tanstack/react-table'
import { useVirtual } from '@tanstack/react-virtual'
import { Typography } from 'ui';
import { useWindowHeight } from 'src/hooks/useWindowHeight';


type TableActions = {
    onEdit: (id: string) => void
    onDelete: (id: string) => Promise<void>
    refresh: () => Promise<void>
}

interface TableProps<T> extends HTMLAttributes<HTMLTableElement>, TableConfig<T> {
    /** data to render */
    data: T[]
    /** Custom row rendering component */
    CellRenderer?: (props: CellRendererProps<T>) => JSX.Element
    /** actions to perform on table rows */
    actions?: TableActions

    disabled?: boolean
}

export interface TableConfig<T> {
    columns: ColumnDef<T>[]
}

type BaseEntity = { id: string }

// TODO: Virtualized lists
// TODO: Format dates properly

export const Table = <T extends BaseEntity,>({ CellRenderer = TableCellRender<T>, columns, data, actions, disabled, ...rest }: TableProps<T>) => {
    const windowHeight = useWindowHeight()
    const table = useReactTable<T>({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        debugTable: true
    })

    const tableContainerRef = React.useRef<HTMLDivElement>(null)

    const { rows } = table.getRowModel();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const { virtualItems: virtualRows } = useVirtual<HTMLDivElement>({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 10
    })


    const { onDelete, onEdit, refresh } = actions ?? {}
    const handleDeleteClick = async (id: string) => {
        try {
            await onDelete?.(id)
            await refresh?.();
        } catch (err) {
            // 
        }
    }

    return (
        <div style={{ maxHeight: windowHeight - 190, overflow: 'auto' }}>
            <div ref={tableContainerRef} {...rest}>
                <table>
                    <TableHeader table={table} />
                    <tbody>
                        {virtualRows.map(({ index }) => {
                            const row = rows[index] as Row<T>;
                            const visibleCells = row?.getVisibleCells();

                            return (
                                <tr key={row?.id}
                                    className={
                                        clsx(
                                            (((index % 2) === 0) ? 'bg-table-row-accent' : 'bg-white'),
                                            'align-middle hover:cursor-pointer'
                                        )
                                    }
                                    onClick={() => onEdit?.(row.original.id)}
                                >
                                    <td className="p-4">
                                        <MenuBar trigger={<button><MoreVertical size={16} /></button>}>
                                            <MenuItem
                                                icon={<Edit size={16} />}
                                            >
                                                Edit
                                            </MenuItem>
                                            <Separator />
                                            <MenuItem
                                                icon={<Trash2 size={16} />}
                                                onClick={_ => { alert('Hi') }}
                                            >
                                                Delete
                                            </MenuItem>
                                        </MenuBar>
                                    </td>
                                    {visibleCells.map(cell => {
                                        const { type, value } = cell.getValue<{ type: TableColumnType, value: CellValueTypes<T> }>()
                                        return (
                                            <td key={cell.id}>
                                                <TableCellRender type={type} value={value} />
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}