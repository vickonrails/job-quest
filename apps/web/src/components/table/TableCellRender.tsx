import { Avatar } from '@/components/avatar';
import { formatDate } from 'shared';
import clsx from 'clsx';
import { type HTMLAttributes } from 'react';
import { Rating } from 'ui';

export type TableColumnType = 'text' | 'date' | 'chips' | 'rating' | 'logoWithText';

export type TableCellValue<T> = (entity: T) => { [key: string]: string | number | string[] | null | undefined }

export type CellValueType<T> = ReturnType<TableCellValue<T>>
export type CellRendererProps<T> = {
    type: TableColumnType
    value: CellValueType<T> | string
} & HTMLAttributes<Omit<HTMLTableCellElement, 'children'>>

export type CellValueTypes<T> = DateCellType<T> | TextCellType<T> | LogoWithTextCellType<T> | LabelCellType<T> | RatingCellType<T>

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

export const TableCellRender = <T,>({ type, value, className, ...rest }: CellRendererProps<T>) => {
    const classNames = clsx('pl-4', className)
    switch (type) {
        case 'date':
            const { date } = value as DateCellType<T>
            // TODO: catch error thrown when another value type is passed
            // TODO: improve the date to show actual 3rd Aug, 2023
            const splitDate = new Date(date).toISOString().split('T')[0]
            if (!splitDate) return;

            const formattedDate = formatDate(splitDate)
            return (
                <td className={classNames} {...rest}>
                    <p className="overflow-ellipsis overflow-hidden">
                        {formattedDate}
                    </p>
                </td>
            );

        case 'logoWithText':
            const { src, text: logoText } = value as LogoWithTextCellType<T>
            return (
                <td className={classNames} {...rest}>
                    <div className="flex items-center gap-2">
                        <Avatar alt="" size="sm" fallbackText={logoText} src={src} />
                        <p className="text-sm">
                            {logoText}
                        </p>
                    </div>
                </td>
            )

        case 'rating':
            const { rating } = value as RatingCellType<T>
            return (
                <td className={classNames}>
                    <Rating value={rating} />
                </td>
            )

        case 'text':
        default:
            const { text } = value as TextCellType<T>
            return (
                <td className={classNames} {...rest}>
                    <div className="text-base-col text-sm py-3 overflow-ellipsis overflow-hidden">
                        {text}
                    </div>
                </td>
            );
    }
}