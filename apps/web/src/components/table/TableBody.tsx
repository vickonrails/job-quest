'use client'
import { DeleteDialog } from '@/components/delete-dialog';
import { MenuBar, MenuItem, Separator } from '@/components/menubar';
import { JobEditSheet } from '@/components/sheet/jobs-edit-sheet';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import { cn } from 'shared';
import { useDeleteModal } from 'src/hooks/useDeleteModal';
import { useEditSheet } from 'src/hooks/useEditModal';
import { type BaseEntity, type Column, type TableActions } from './Table';
import { TableCellRender } from './TableCellRender';

interface TableBody<T> {
    items: T[]
    columns: Column<T>
    actions?: TableActions;
    hideActions?: boolean
}
/** 
 * Table body component
 */
export function TableBody<T extends BaseEntity>({ items, columns, actions, hideActions }: TableBody<T>) {
    const { onDelete, refresh, onRowClick } = actions ?? {}
    // default onDelete, onRowClick, onEditClick
    const {
        showDeleteDialog,
        isOpen: deleteModalOpen,
        onCancel,
        handleDelete,
        setIsOpen: setIsDeleteModalOpen,
        loading: isDeleting
    } = useDeleteModal<T>({ onDelete, refresh })

    const { isOpen: editSheetOpen, showEditSheet, setIsOpen, selectedEntity } = useEditSheet<T>({ refresh })

    return (
        <>
            <tbody className="text-muted-foreground">
                {items.map((item, index) => (
                    <tr
                        className={cn(
                            'align-middle hover:cursor-pointer hover:bg-secondary'
                        )}
                        key={index}
                        onClick={_ => onRowClick?.(item.id)}
                    >
                        {!hideActions && (
                            <td className="pl-4 border-b border-l text-muted-foreground">
                                <MenuBar
                                    triggerProps={{ className: 'data-[state=open]:outline rounded-sm outline-gray-300' }}
                                    trigger={<MoreVertical size={16} />}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <MenuItem
                                        icon={<Edit size={16} />}
                                        onClick={() => showEditSheet?.(item)}
                                    >
                                        Edit
                                    </MenuItem>
                                    <Separator />
                                    <MenuItem
                                        className="text-red-400 hover:bg-red-50"
                                        icon={<Trash2 size={16} />}
                                        onClick={_ => showDeleteDialog(item)}
                                    >
                                        Delete
                                    </MenuItem>
                                </MenuBar>
                            </td>
                        )}

                        {columns.map((column, idx) => {
                            const value = column.renderValue?.(item)
                            const type = column.type
                            return (
                                <TableCellRender key={idx} type={type} value={value ?? ''} className="max-w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis border" />
                            )
                        })}
                    </tr>
                ))}
            </tbody>

            <DeleteDialog
                open={deleteModalOpen}
                title="Delete Confirmation"
                description="Are you sure you want to delete this job?"
                onOk={handleDelete}
                // TODO: figure out why this isn't working
                onOpenChange={setIsDeleteModalOpen}
                onCancel={onCancel}
                isProcessing={isDeleting}
            />

            {editSheetOpen && (
                <JobEditSheet
                    entity={selectedEntity}
                    open={editSheetOpen}
                    title="Edit Job"
                    onOpenChange={setIsOpen}
                />
            )}
        </>
    )
}
