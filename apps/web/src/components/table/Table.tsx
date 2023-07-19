import React, { type JSX, ReactNode, type HTMLAttributes, Component } from 'react'
import clsx from 'clsx'
import { Typography } from 'ui';

interface TableProps<T> extends HTMLAttributes<HTMLTableElement>, TableConfig {
    data: T[]
    CellRenderer?: (props: CellRendererProps<T>) => JSX.Element
}

type TableColumnType = 'text' | 'date' | 'chips' | 'rating' | 'logoWithText';
export interface TableConfig {
    columns: {
        title: string;
        columnType: TableColumnType
        key: string
        value?: any
    }[]
}

type Obj = { [key: string]: string | number | null | undefined }

// TODO: width of columns
// TODO: horizontal scroll for table
// TODO: Virtualized lists
// TODO: Format dates properly

export const Table = <T extends Obj,>({ CellRenderer = TableCellRender<T>, columns, data, ...rest }: TableProps<T>) => {
    return (
        <table className="w-full border-collapse" {...rest}>
            <TableHeader columns={columns} />
            <tbody>
                {data.map((row, index) => (
                    <tr key={index} className={
                        clsx(
                            (((index % 2) === 0) ? 'bg-table-row-accent' : 'bg-white'),
                            'align-middle'
                        )}>
                        {/* <input type="checkbox" /> */}
                        {columns.map((col, idx) =>
                            <CellRenderer value={col?.value(row)} key={idx} type={col.columnType} />
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

interface TableHeaderProps {
    columns: TableConfig['columns']
}

type CompanyCellProps = {
    company_site: string,
    company_name: string
}

export type CellRendererProps<T> = {
    type: TableColumnType
    // TODO: add more detailed types for value
    value: { [key: string]: string | number | null }
} & HTMLAttributes<Omit<HTMLTableCellElement, 'children'>>



export const TableCellRender = <T,>({ type, value, ...rest }: CellRendererProps<T>) => {

    switch (type) {
        case 'date':
            // TODO: catch error thrown when another value type is passed
            // TODO: improve the date to show actual 3rd Aug, 2023
            const formattedDate = new Date(value.date as string).toISOString().split('T')[0]
            return (
                <td {...rest}>
                    <Typography variant="body-sm">
                        {formattedDate}
                    </Typography>
                </td>
            );

        case 'logoWithText':
            return (
                <td {...rest}>
                    <div className="flex items-center">
                        <img src={value.src} className="h-6 rounded-md mr-2" />
                        <Typography variant="body-sm">
                            {value.text}
                        </Typography>
                    </div>
                </td>
            )


        case 'text':
        default:
            return (
                <td className="text-left" {...rest}>
                    <Typography variant="body-sm" className="text-base-col py-4 pl-4">
                        {value.text}
                    </Typography>
                </td>
            );
    }
}

export const TableHeader = ({ columns }: TableHeaderProps) => {
    return (
        <thead className="bg-white rounded-t-xl">
            <tr>
                {/* <th className="border-b-2 rounded-tl-xl">
                    <input type="checkbox" />
                </th> */}
                {columns.map((column, idx) => (
                    <th key={column.title} className={
                        clsx(
                            'text-left text-light-text py-4 pl-4 bg-white border-solid border-b-2 font-normal',
                            idx === 0 && 'rounded-tl-xl',
                            idx === columns.length - 1 && 'rounded-tr-xl'
                        )
                    }>
                        <Typography variant="body-sm">{column.title}</Typography>
                    </th>
                ))}
            </tr>
        </thead>
    )
}