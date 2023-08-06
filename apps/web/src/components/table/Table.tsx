import React, { type HTMLAttributes, type JSX, useState, ReactNode, ReactElement } from 'react'
import clsx from 'clsx'
import { Edit, Trash2, MoreVertical } from 'react-feather';
import { TableCellRender, type TableColumnType, type CellValueTypes } from './TableCellRender';
import { TableHeader } from './TableHeader';
import { MenuBar, MenuItem, Separator } from '@components/menubar'

import { useReactTable, type ColumnDef, getCoreRowModel, type Row, getSortedRowModel } from '@tanstack/react-table'
import { useVirtual } from '@tanstack/react-virtual'
import { useWindowHeight } from 'src/hooks/useWindowHeight';
import { AlertDialog } from '@components/alert-dialog';
import { useRouter } from 'next/router';
import { Dialog } from '@components/dialog';
import { Button, Input } from 'ui';
import { Job } from 'lib/types';

export type TableActions = {
    onEditClick: (id: string) => void
    onDelete: (id: string) => Promise<void>
    refresh: () => Promise<void>
    onRowClick: (id: string) => void
}

interface TableProps<T> extends HTMLAttributes<HTMLTableElement>, TableConfig<T> {
    /** data to render */
    data: T[]
    /** actions to perform on table rows */
    actions?: TableActions

    disabled?: boolean

    EditForm?: (props: EditJobFormProps<T>) => JSX.Element
}

export interface TableConfig<T> {
    columns: ColumnDef<T>[]
}

type BaseEntity = { id: string }

// TODO: Virtualized lists
// TODO: Format dates properly

export const Table = <T extends BaseEntity,>({ columns, data, EditForm, actions, ...rest }: TableProps<T>) => {
    const windowHeight = useWindowHeight()
    const router = useRouter();
    const { onDelete, onEditClick, refresh, onRowClick } = actions ?? {}
    // TODO: move the delete dialog utility to a separate hook
    const [selectedEntity, setSelectedEntity] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    const openDeleteDialog = React.useCallback((entity: T) => {
        setShowDeleteDialog(true)
        setSelectedEntity(entity);
    }, [])

    const handleDeleteCancel = React.useCallback(() => {
        setShowDeleteDialog(false)
        setSelectedEntity(null)
    }, [])

    const handleEditClick = React.useCallback((entity: T) => {
        // setShowEditDialog(true)
        // setSelectedEntity(entity)
        return router.push(`tracker/jobs/${entity.id}/edit`)
    }, [router])

    const handleEditCancel = React.useCallback(() => {
        setShowEditDialog(false);
        setSelectedEntity(null)
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
                                <tr key={row?.id}
                                    className={
                                        clsx(
                                            (((index % 2) === 0) ? 'bg-table-row-accent' : 'bg-white'),
                                            'align-middle hover:cursor-pointer'
                                        )
                                    }
                                >
                                    <td className="p-4">
                                        <MenuBar
                                            triggerProps={{ className: 'data-[state=open]:outline rounded-sm outline-gray-300' }}
                                            trigger={<MoreVertical size={16} />}
                                        >
                                            <MenuItem
                                                icon={<Edit size={16} />}
                                                // onClick={_ => onEditClick?.(row.original.id)}
                                                onClick={_ => handleEditClick(row?.original)}
                                            >
                                                Edit
                                            </MenuItem>
                                            <Separator />
                                            <MenuItem
                                                className="text-red-400 hover:bg-red-50"
                                                icon={<Trash2 size={16} />}
                                                onClick={() => openDeleteDialog(row.original)}
                                            >
                                                Delete
                                            </MenuItem>
                                        </MenuBar>
                                    </td>
                                    {visibleCells.map(cell => {
                                        const { type, value } = cell.getValue<{ type: TableColumnType, value: CellValueTypes<T> }>()
                                        // TODO: might not be that performant to have this event handlers on the cell themselves,
                                        // but it's the only way to implement the menubar functionality
                                        // Will refactor later
                                        return (
                                            <td key={cell.id} onClick={() => onRowClick?.(row.original.id)}>
                                                <TableCellRender type={type} value={value} />
                                            </td>
                                        )
                                    })}
                                </tr>
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
                        onCancel={handleDeleteCancel}
                        isProcessing={loading}
                    />
                )}

                {/* {showEditDialog && (
                    <Dialog
                        open={showEditDialog}
                        title="Edit Job"
                        onOpenChange={handleEditCancel}
                    >
                        <CreateEditJobForm<T> entity={selectedEntity ?? undefined} />
                    </Dialog>
                )} */}

                {showEditDialog && (
                    <Dialog
                        open={showEditDialog}
                        title="Edit Job"
                        onOpenChange={handleEditCancel}
                    >
                        {EditForm && <EditForm entity={selectedEntity ?? undefined} />}
                        {/* {EditForm?.({ entity: selectedEntity ?? undefined })} */}
                    </Dialog>
                )}
            </div>
        </div>
    )
}

export type EditJobFormProps<T> = HTMLAttributes<HTMLFormElement> & { entity?: T }