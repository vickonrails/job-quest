import { AlertDialog } from '@components/alert-dialog';
import { useRowDelete } from 'src/hooks/useDeleteModal';
import { type BaseEntity, type Column, type TableActions } from './Table';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { Edit, MoreVertical, Trash2 } from 'react-feather';
import { TableCellRender } from './TableCellRender';
import { useEditSheet } from 'src/hooks/useEditModal';
import clsx from 'clsx';
import { JobEditSheet } from '@components/sheet/jobsEditSheet';

interface TableBody<T> {
    items: T[]
    columns: Column<T>
    actions: TableActions;
    hideActions?: boolean
}
/** 
 * Table body component
 */
export function TableBody<T extends BaseEntity>({ items, columns, actions, hideActions }: TableBody<T>) {
    const { onDelete, refresh, onRowClick } = actions
    // default onDelete, onRowClick, onEditClick
    const {
        showDeleteDialog,
        isOpen: deleteModalOpen,
        onCancel,
        handleDelete,
        loading: isDeleting
    } = useRowDelete<T>({ onDelete, refresh })

    const { isOpen: editSheetOpen, showEditSheet, setIsOpen, selectedEntity } = useEditSheet<T>({ refresh })

    return (
        <>
            <tbody>
                {items.map((item, index) => (
                    <tr
                        className={clsx(
                            (((index % 2) === 0) ? 'bg-gray-100' : 'bg-white'),
                            'align-middle hover:cursor-pointer hover:bg-gray-50'
                        )}
                        key={index}
                        onClick={_ => onRowClick?.(item.id)}
                    >
                        {!hideActions && (
                            <td className="pl-4">
                                <MenuBar
                                    triggerProps={{ className: 'data-[state=open]:outline rounded-sm outline-gray-300' }}
                                    trigger={<MoreVertical size={16} />}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <MenuItem
                                        icon={<Edit size={16} />}
                                        onClick={_ => showEditSheet?.(item)}
                                        la
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
                                <TableCellRender key={idx} type={type} value={value ?? ''} className="max-w-[150px] overflow-hidden whitespace-nowrap overflow-ellipsis" />
                            )
                        })}
                    </tr>
                ))}
            </tbody>

            <AlertDialog
                open={deleteModalOpen}
                title="Delete Confirmation"
                description="Are you sure you want to delete this job?"
                onOk={handleDelete}
                // TODO: figure out why this isn't working
                onOpenChange={setIsOpen}
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
