import React, { type JSX, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Edit, Trash2 } from 'react-feather';
import { type CellRendererProps, TableCellRender, type TableColumnType, type TableCellValue } from './TableCellRender';
import { TableHeader } from './TableHeader';

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
    columns: {
        title: string;
        columnType: TableColumnType
        key: string
        value: TableCellValue<T>
        width: number
    }[]
}

type BaseEntity = { id: string }

// TODO: Virtualized lists
// TODO: Format dates properly

export const Table = <T extends BaseEntity,>({ CellRenderer = TableCellRender<T>, columns, data, actions, disabled, ...rest }: TableProps<T>) => {
    const { onDelete, onEdit, refresh } = actions ?? {}
    const handleDeleteClick = async (id: string) => {
        try {
            await onDelete?.(id)
            await refresh?.();
        } catch (err) {
            // 
        }
    }

    const handleEditClick = (id: string) => onEdit && onEdit(id)

    const tableWidth = columns.reduce((acc, curr) => acc + curr.width, 0)
    return (
        <table className={
            clsx(
                'border-collapse transition-opacity',
                disabled ? 'opacity-75 pointer-events-none' : 'opacity-100'
            )
        } style={{ width: tableWidth }}{...rest}>
            <TableHeader columns={columns} />
            <tbody>
                {data.map((row, index) => (
                    <>
                        <tr key={index} className={
                            clsx(
                                (((index % 2) === 0) ? 'bg-table-row-accent' : 'bg-white'),
                                'align-middle'
                            )}>
                            <td className="flex p-4 pr-7 text-light-text">
                                <button className="mr-4" onClick={_ => handleEditClick(row.id)}>
                                    <Edit size={16} />
                                </button>
                                <button onClick={_ => handleDeleteClick(row.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </td>
                            {columns.map((col, idx) =>
                                <CellRenderer value={col?.value(row)} key={idx} type={col.columnType} />
                            )}
                        </tr>
                    </>
                ))}
            </tbody>
        </table>
    )
}