import { AlertDialog } from '@components/alert-dialog';
import { useRowDelete } from 'src/hooks/useDeleteModal';
import { type BaseEntity, type Column, type TableActions } from './Table';
import { MenuBar, MenuItem, Separator } from '@components/menubar';
import { Edit, MoreVertical, Trash2 } from 'react-feather';
import { TableCellRender } from './TableCellRender';
import { Sheet, type SheetProps } from '..';
import { useEditSheet } from 'src/hooks/useEditModal';
import clsx from 'clsx';
import { type Job } from 'lib/types';
import { Input } from '@components/input';
import { Status_Lookup } from './job/JobsTable';
import { Select } from '@components/select';
import { SelectOption } from '@components/select/select';
import { Button } from '@components/button';
import { Formik, Form } from 'formik'
import { Rating } from '@components/rating/Rating';

/** 
 * Table body component
 */
export function TableBody<T extends BaseEntity>({ items, columns, actions }: { items: T[], columns: Column<T>, actions: TableActions }) {
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
                            (((index % 2) === 0) ? 'bg-gray-50' : 'bg-white'),
                            'align-middle hover:cursor-pointer'
                        )}
                        key={index}
                        onClick={_ => onRowClick?.(item.id)}
                    >
                        <td className="pl-4">
                            <MenuBar
                                triggerProps={{ className: 'data-[state=open]:outline rounded-sm outline-gray-300' }}
                                trigger={<MoreVertical size={16} />}
                                onClick={e => e.stopPropagation()}
                            >
                                <MenuItem
                                    icon={<Edit size={16} />}
                                    onClick={_ => showEditSheet?.(item)}
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

interface JobEditSheetProps<T> extends SheetProps {
    entity: T
}

// TODO: unify the shadcn ui & personal input components
function JobEditSheet<T>(props: JobEditSheetProps<T>) {
    // TODO: abstract this away
    const entity = props.entity as Job;
    const statusOptions = Status_Lookup.map((x, idx) => ({ value: String(idx), label: x }))

    const onSubmit = (data: Job) => {
        // add a mutation
    }
    const initialValues = { ...entity }

    return (
        <Sheet {...props}>
            <div className="flex flex-col gap-3">
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                >
                    {({ values, handleSubmit, handleChange, setFieldValue, resetForm }) => (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <Input
                                placeholder="Job title"
                                value={values.position}
                                name="position"
                                fullWidth
                                label="Position"
                                onChange={handleChange}
                            />
                            <div className="mb-4">
                                <div className="mb-3 text-sm">Rating</div>
                                <Rating value={values.priority ?? 0} />
                            </div>
                            <Select
                                name="status"
                                label="Select"
                                trigger="Select a status"
                                // TODO: figure out why just handleChange doesn't seem to work here
                                onValueChange={val => setFieldValue('status', Number(val))}
                                options={statusOptions}
                                value={String(values.status)}
                            />
                            <Input
                                placeholder="Company name"
                                label="Company name"
                                name="company_name"
                                onChange={handleChange}
                                value={values.company_name}
                                fullWidth
                            />
                            <Input
                                placeholder="Company site"
                                label="Company site"
                                name="company_site"
                                onChange={handleChange}
                                value={values.company_site ?? ''}
                                fullWidth
                                hint="For providing the company logo by the side"
                            />
                            <Button type="submit">Update</Button>
                            <Button type="button" fillType="text" size="sm" onClick={() => resetForm(initialValues)}>Clear Changes</Button>
                        </form>
                    )}
                </Formik>
            </div>
        </Sheet>
    )
}