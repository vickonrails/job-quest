import { AlertDialog } from '@components/alert-dialog';
import { useRowDelete } from 'src/hooks/useDeleteModal';
import { type BaseEntity, type Column, type TableActions } from './Table';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { Edit, MoreVertical, Trash2 } from 'react-feather';
import { TableCellRender } from './TableCellRender';

/** 
 * Table body component
 */
export function TableBody<T extends BaseEntity>({ items, columns, actions }: { items: T[], columns: Column<T>, actions: TableActions }) {
    const { onDelete, refresh, onEditClick, onRowClick } = actions
    const {
        showDeleteDialog,
        isOpen,
        onCancel,
        handleDelete,
        loading: isDeleting
    } = useRowDelete<T>({ onDelete, refresh })

    return (
        <>
            <tbody>
                {items.map((item, index) => (
                    <tr className="bg-white hover:cursor-pointer" key={index} onClick={_ => onRowClick?.(item.id)}>
                        <td className="pl-4">
                            <MenuBar
                                triggerProps={{ className: 'data-[state=open]:outline rounded-sm outline-gray-300' }}
                                trigger={<MoreVertical size={16} />}
                                onClick={e => e.stopPropagation()}
                            >
                                <MenuItem
                                    icon={<Edit size={16} />}
                                    onClick={_ => onEditClick?.(item.id)}
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

            <AlertDialog
                open={isOpen}
                title="Delete Confirmation"
                description="Are you sure you want to delete this job?"
                onOk={handleDelete}
                onCancel={onCancel}
                isProcessing={isDeleting}
            />
        </>
    )
}
