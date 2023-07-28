import clsx from 'clsx';
import { Typography } from 'ui';
import { Chip } from '@components/chips';
import { Rating } from '@components/rating/Rating';
import { djb2Hash } from '@components/utils';
import { type ChipVariants } from '@components/chips/Chip';
import Image from 'next/image';
import { type HTMLAttributes } from 'react';

export type TableColumnType = 'text' | 'date' | 'chips' | 'rating' | 'logoWithText';

export type TableCellValue<T> = (entity: T) => { [key: string]: string | number | string[] | null | undefined }

type CellValueType<T> = ReturnType<TableCellValue<T>>
export type CellRendererProps<T> = {
    type: TableColumnType
    value: CellValueType<T>
} & HTMLAttributes<Omit<HTMLTableCellElement, 'children'>>

type DateCellType<T> = CellValueType<T> & {
    date: string
}

type TextCellType<T> = CellValueType<T> & {
    text: string
}

type LogoWithTextCellType<T> = CellValueType<T> & {
    text: string
    src: string
}

type LabelCellType<T> = CellValueType<T> & {
    labels: string[]
}

type RatingCellType<T> = CellValueType<T> & {
    rating: 1 | 2 | 3 | 4 | 5
}

export const TableCellRender = <T,>({ type, value, ...rest }: CellRendererProps<T>) => {
    const className = clsx('pl-4')
    switch (type) {
        case 'date':
            const { date } = value as DateCellType<T>
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
            const { src, text: logoText } = value as LogoWithTextCellType<T>
            return (
                <td className={className} {...rest}>
                    <div className="flex items-center">
                        {src && <Image src={src ?? ''} className="rounded-md mr-2" alt="" width={24} height={24} />}
                        <Typography variant="body-sm">
                            {logoText}
                        </Typography>
                    </div>
                </td >
            )

        case 'chips':
            const { labels = [] } = value as LabelCellType<T>
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
            const { rating } = value as RatingCellType<T>
            return (
                <td className={className}>
                    <Rating value={rating} />
                </td>
            )

        case 'text':
        default:
            const { text } = value as TextCellType<T>
            return (
                <td className={className} {...rest}>
                    <Typography variant="body-sm" className="text-base-col py-4">
                        {text}
                    </Typography>
                </td>
            );
    }
}