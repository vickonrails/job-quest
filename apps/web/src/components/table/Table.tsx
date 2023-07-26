import React, { type JSX, type HTMLAttributes } from 'react'
import clsx from 'clsx'
import { Typography } from 'ui';
import { Edit, Trash2 } from 'react-feather'
import { Chip } from '@components/chips';
import { type ChipVariants } from '@components/chips/Chip';
import { Rating } from '@components/rating/Rating';
import { useRouter } from 'next/router';

interface TableProps<T> extends HTMLAttributes<HTMLTableElement>, TableConfig {
    data: T[]
    CellRenderer?: (props: CellRendererProps) => JSX.Element
}

type TableColumnType = 'text' | 'date' | 'chips' | 'rating' | 'logoWithText';
export interface TableConfig {
    columns: {
        title: string;
        columnType: TableColumnType
        key: string
        value: any,
        width: number
    }[]
}

type Obj = { id: string, [key: string]: string | number | null | undefined }

// TODO: Virtualized lists
// TODO: Format dates properly

export const Table = <T extends Obj,>({ CellRenderer = TableCellRender<T>, columns, data, ...rest }: TableProps<T>) => {
    const router = useRouter();

    const navigateToDetails = (id: string) => {
        router.push(`/app/tracker/jobs/${id}`).then(() => {
            // 
        }).catch(err => {
            // 
        })
    }

    const tableWidth = columns.reduce((acc, curr) => acc + curr.width, 0)
    return (
        <table className=" border-collapse" style={{ width: tableWidth }}{...rest}>
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
                                <button className="mr-4" onClick={_ => navigateToDetails(row.id)}>
                                    <Edit size={16} />
                                </button>
                                <button>
                                    <Trash2 size={16} />
                                </button>
                            </td>
                            {/* <input type="checkbox" /> */}
                            {columns.map((col, idx) =>
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
                                <CellRenderer value={col?.value(row)} key={idx} type={col.columnType} />
                            )}
                        </tr>
                    </>
                ))}
            </tbody>
        </table>
    )
}

interface TableHeaderProps {
    columns: TableConfig['columns']
}

type DateCellType = {
    date: string
}

type TextCellType = {
    text: string
}

type LogoWithTextCellType = {
    text: string
    src: string
}

type LabelCellType = {
    labels: string[]
}

type RatingCellType = {
    rating: 1 | 2 | 3 | 4 | 5
}

export type CellRendererProps = {
    type: TableColumnType
    // TODO: add more detailed types for value
    value: any
} & HTMLAttributes<Omit<HTMLTableCellElement, 'children'>>


export const TableCellRender = <T,>({ type, value, ...rest }: CellRendererProps) => {
    const className = clsx('pl-4')
    switch (type) {
        case 'date':
            const { date } = value as DateCellType
            // TODO: catch error thrown when another value type is passed
            // TODO: improve the date to show actual 3rd Aug, 2023
            const formattedDate = new Date(date).toISOString().split('T')[0]
            return (
                <td className={className} {...rest}>
                    <Typography variant="body-sm">
                        {formattedDate}
                    </Typography>
                </td>
            );

        case 'logoWithText':
            const { src, text: logoText } = value as LogoWithTextCellType
            return (
                <td className={className} {...rest}>
                    <div className="flex items-center">
                        {src && <img src={src ?? ''} className="h-6 rounded-md mr-2" alt={logoText} />}
                        <Typography variant="body-sm">
                            {logoText}
                        </Typography>
                    </div>
                </td >
            )

        case 'chips':
            const { labels = [] } = value as LabelCellType
            const variants = ['blue', 'purple', 'green', 'gold', 'orange']

            const getChipColors = (text: string) => {
                const index = djb2Hash(text, variants.length)
                return variants[index]
            }

            return (
                <td className={className}>
                    <div className="flex align-middle">{
                        labels?.map(label => {
                            const variant = getChipColors(label) as ChipVariants;
                            return (<Chip key={label} variant={variant} label={label} />)
                        })}
                    </div>
                </td>
            )

        case 'rating':
            const { rating } = value as RatingCellType
            return (
                <td className={className}>
                    <Rating value={rating} />
                </td>
            )

        case 'text':
        default:
            const { text } = value as TextCellType
            return (
                <td className={className} {...rest}>
                    <Typography variant="body-sm" className="text-base-col py-4">
                        {text}
                    </Typography>
                </td>
            );
    }
}

export const TableHeader = ({ columns }: TableHeaderProps) => {
    return (
        <thead className="bg-white rounded-t-xl">
            <tr>
                <th className="border-b-2">
                    <Typography variant="body-sm" className="text-light-text font-normal">Actions</Typography>
                </th>
                {columns.map((column, idx) => (
                    <th key={column.title} className={
                        clsx(
                            'text-left  py-4 pl-4 bg-white border-solid border-b-2',
                            // idx === 0 && 'rounded-tl-xl',
                            // idx === columns.length - 1 && 'rounded-tr-xl'
                        )
                    } style={{ width: column.width }}>
                        <Typography variant="body-sm" className="text-light-text font-normal">{column.title}</Typography>
                    </th>
                ))}
            </tr>
        </thead>
    )
}

function djb2Hash(str: string, arrayLength: number) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return Math.abs(hash) % arrayLength;
}