import React, { type HTMLAttributes, type JSX, useState } from 'react'
import { Edit, Trash2, MoreVertical } from 'react-feather';
import { TableCellRender, type TableColumnType } from './TableCellRender';
import { TableHeader } from './TableHeader';
import { MenuBar, MenuItem, Separator } from '@components/menubar'

import { useWindowHeight } from 'src/hooks/useWindowHeight';
import { AlertDialog } from '@components/alert-dialog';
import { useRouter } from 'next/router';
import { Dialog } from '@components/dialog';

export type TableActions = {
    onEditClick: (id: string) => void
    onDelete: (id: string) => Promise<void>
    refresh: () => Promise<void>
    onRowClick: (id: string) => void
}

interface TableProps<T> extends HTMLAttributes<HTMLTableElement> {
    /** data to render */
    data: T[]
    /** actions to perform on table rows */
    actions?: TableActions

    disabled?: boolean

    columns: Column<T>

    EditForm?: (props: EditJobFormProps<T>) => JSX.Element
}

type BaseEntity = { id: string }

// TODO: Virtualized lists
// TODO: Format dates properly

type ColumnDef<T> = {
    header: string,
    key?: string,
    type: TableColumnType,
    renderValue?: (item: T) => ({ [key: string]: string | number })
}
export type Column<T> = ColumnDef<T>[]

export function Table<T extends BaseEntity,>({ columns, data, EditForm, actions, ...rest }: TableProps<T>) {
    const windowHeight = useWindowHeight()
    const { onDelete, refresh } = actions ?? {}
    // TODO: move the delete dialog utility to a separate hook
    const [selectedEntity, setSelectedEntity] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)

    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditDialog, setShowEditDialog] = useState(false)

    // const openDeleteDialog = React.useCallback((entity: T) => {
    //     setShowDeleteDialog(true)
    //     setSelectedEntity(entity);
    // }, [])

    const handleDeleteCancel = React.useCallback(() => {
        setShowDeleteDialog(false)
        setSelectedEntity(null)
    }, [])

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

    return (
        <div style={{ maxHeight: windowHeight - 190, overflow: 'auto', position: 'relative' }}>
            <div {...rest}>
                <table className="w-full">
                    <TableHeader<T> columns={columns} />
                    <TableBody<T> items={data} columns={columns} actions={actions} />
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

                {showEditDialog && (
                    <Dialog
                        open={showEditDialog}
                        title="Edit Job"
                        onOpenChange={handleEditCancel}
                    >
                        {/* TODO: yank this off */}
                        {EditForm && <EditForm entity={selectedEntity ?? undefined} />}
                    </Dialog>
                )}
            </div>
        </div>
    )
}

export type EditJobFormProps<T> = HTMLAttributes<HTMLFormElement> & { entity?: T }

// TODO: move to another component
function TableBody<T extends BaseEntity>({ items, columns, actions }: { items: T[], columns: Column<T>, actions?: TableActions }) {
    return (
        <tbody>
            {items.map((item, index) => (
                <tr className="bg-white" key={index} onClick={_ => actions?.onRowClick(item.id)}>
                    <td className="pl-4">
                        <MenuBar
                            triggerProps={{ className: 'data-[state=open]:outline rounded-sm outline-gray-300' }}
                            trigger={<MoreVertical size={16} />}
                            onClick={e => e.stopPropagation()}
                        >
                            <MenuItem
                                icon={<Edit size={16} />}
                                onClick={_ => actions?.onEditClick(item.id)}
                            >
                                Edit
                            </MenuItem>
                            <Separator />
                            <MenuItem
                                className="text-red-400 hover:bg-red-50"
                                icon={<Trash2 size={16} />}
                            >
                                Delete
                            </MenuItem>
                        </MenuBar>
                    </td>

                    {columns.map((column, idx) => {
                        const value = column.renderValue?.(item)
                        const type = column.type
                        return (
                            <TableCellRender key={idx} type={type} value={value ?? ''} />
                        )
                    })}
                </tr>
            ))}
        </tbody>
    )
}