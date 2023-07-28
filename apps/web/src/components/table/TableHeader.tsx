import { Typography } from 'ui'
import { type TableConfig } from './Table'

interface TableHeaderProps<T> {
    columns: TableConfig<T>['columns']
}

export const TableHeader = <T,>({ columns }: TableHeaderProps<T>) => {
    return (
        <thead className="bg-white rounded-t-xl">
            <tr>
                <th className="border-b-2">
                    <Typography variant="body-sm" className="text-light-text font-normal">Actions</Typography>
                </th>
                {columns.map((column, idx) => (
                    <th
                        key={idx}
                        className="text-left  py-4 pl-4 bg-white border-solid border-b-2"
                        style={{ width: column.width }}
                    >
                        <Typography variant="body-sm" className="text-light-text font-normal">
                            {column.title}
                        </Typography>
                    </th>
                ))}
            </tr>
        </thead>
    )
}

