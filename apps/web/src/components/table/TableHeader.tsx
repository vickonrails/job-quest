import { Typography } from 'ui'
import { type Table, flexRender } from '@tanstack/react-table'

interface TableHeaderProps<T> {
    table: Table<T>
}

export const TableHeader = <T,>({ table }: TableHeaderProps<T>) => {
    return (
        <thead className="sticky top-0 border-b-2 rounded-sm bg-white">
            <tr>
                <th className="border-b-2 p-4 text-left" style={{ width: 80 }}>
                    <Typography variant="body-sm" className="text-light-text font-normal">Actions</Typography>
                </th>
                {table.getFlatHeaders().map((header => (
                    <th
                        key={header.id}
                        className="text-left p-4 border-solid border-b-2"
                        style={{ width: header.column.getSize() }}
                    >
                        <Typography variant="body-sm" className="text-light-text font-normal">
                            {
                                flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )
                            }
                        </Typography>
                    </th>
                )))
                }
            </tr>
        </thead>
    )
}