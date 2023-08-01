import React, { type HTMLAttributes, useState, useEffect, FC } from 'react'
import clsx from 'clsx'
import { Edit, Trash2, MoreVertical } from 'react-feather';
import { TableCellRender, type TableColumnType, type CellValueTypes } from './TableCellRender';
import { TableHeader } from './TableHeader';
import { MenuBar, MenuItem, Separator } from '@components/menubar'

import { useReactTable, type ColumnDef, getCoreRowModel, type Row, getSortedRowModel, Cell } from '@tanstack/react-table'
import { useVirtual } from '@tanstack/react-virtual'
import { useWindowHeight } from 'src/hooks/useWindowHeight';
import { AlertDialog } from '@components/alert-dialog';

type TableActions = {
    onEdit: (id: string) => void
    onDelete: (id: string) => Promise<void>
    refresh: () => Promise<void>
}

interface TableProps<T> extends HTMLAttributes<HTMLTableElement>, TableConfig<T> {
    /** data to render */
    data: T[]
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

export const Table = <T extends BaseEntity,>({ columns, data, actions, ...rest }: TableProps<T>) => {
    const windowHeight = useWindowHeight()
    const { onDelete, onEdit, refresh } = actions ?? {}
    // TODO: move the delete dialog utility to a separate hook
    const [selectedEntity, setSelectedEntity] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const openDeleteDialog = React.useCallback((entity: T) => {
        setShowDeleteDialog(true)
        setSelectedEntity(entity);
    }, [])

    const handleRowDelete = (id: string) => {
        setLoading(true)
        onDelete?.(id).then(async () => {
            await refresh?.()
            setShowDeleteDialog(false)
        }).catch(err => {
            // 
        }).finally(() => {
            setLoading(false)
        })
    }

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

    return (
        <div style={{ maxHeight: windowHeight - 190, overflow: 'auto', position: 'relative' }}>
            <div ref={tableContainerRef} {...rest}>
                <table>
                    <TableHeader table={table} />
                    {/* TODO: refactor to it's component */}
                    <tbody>
                        {virtualRows.map(({ index }) => {
                            const row = rows[index] as Row<T>;
                            const visibleCells = row?.getVisibleCells();

                            return (
                                <TableRow
                                    key={row.id}
                                    visibleCells={visibleCells}
                                    row={row}
                                    onEdit={onEdit}
                                />
                            )
                        })}
                    </tbody>
                </table>
                {showDeleteDialog && (
                    <AlertDialog
                        open={showDeleteDialog}
                        title="Delete Confirmation"
                        description="Are you sure you want to delete this job?"
                        onOk={() => handleRowDelete(selectedEntity?.id ?? '')}
                        isProcessing={loading}
                    />
                )}
            </div>
        </div>
    )
}

interface TableRowProps<T> extends HTMLAttributes<HTMLTableRowElement> {
    row: Row<T>
    onEdit?: (id: string) => void
    visibleCells: Cell<T, unknown>[]
}


// className={
//     clsx(
//         (((index % 2) === 0) ? 'bg-table-row-accent' : 'bg-white'),
//         'align-middle hover:cursor-pointer'
//     )
// }

const TableRow = <T extends BaseEntity,>({ row, visibleCells, onEdit, ...rest }: TableRowProps<T>) => {
    const rowRef = React.useRef<HTMLTableRowElement>(null)

    useEffect(() => {
        const handleOnEditClick = () => {
            onEdit?.(row?.original?.id)
        }

        const tableRow = rowRef.current;
        tableRow?.addEventListener('click', handleOnEditClick)
        return () => {
            tableRow?.removeEventListener('click', handleOnEditClick)
        }
    }, [row, onEdit])

    return (
        <tr
            ref={rowRef}
            key={row?.id}
            {...rest}
        >
            <td className="p-4">
                <MenuBar className="p-1" trigger={<MoreVertical size={16} />}>
                    <MenuItem
                        icon={<Edit size={16} />}
                        onClick={() => onEdit?.(row.original.id)}
                    >
                        Edit
                    </MenuItem>
                    <Separator />
                    <MenuItem
                        icon={<Trash2 size={16} />}
                    // onClick={() => openDeleteDialog(row.original)}
                    >
                        Delete
                    </MenuItem>
                </MenuBar>
            </td>
            {visibleCells?.map(cell => {
                const { type, value } = cell.getValue<{ type: TableColumnType, value: CellValueTypes<T> }>()
                return (
                    <td key={cell.id} onClick={() => onEdit?.(row.original.id)}>
                        <TableCellRender type={type} value={value} />
                    </td>
                )
            })}
        </tr>
    )
}