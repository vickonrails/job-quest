import { Droppable } from '@hello-pangea/dnd';
import { type Job } from '@lib/types';
import { cn } from '@utils/cn';
import { type KanbanColumn } from '@utils/transform-to-column';
import { getColumnHeaderProps } from './core/getHeaderProperties';
import { KanbanCard as DefaultKanbanCard } from './kanban-card';

export interface KanbanCardProps {
    job: Job
    index: number
    openEditSheet?: (job?: Job) => void
    openDeleteDialog?: (job: Job) => void
}

interface KanbanColumnProps {
    column: KanbanColumn
    openEditSheet?: (job?: Job) => void
    openDeleteDialog?: (job: Job) => void
    KanbanCard?: React.ComponentType<KanbanCardProps>
}

function ColumnHeaders({ column }: { column: KanbanColumn }) {
    const { bgColor, textColor } = getColumnHeaderProps(column)
    return (
        <header className="flex justify-between items-center sticky top-0 p-2 pb-1">
            <h2 className={cn('text-sm w-full border bg-white text-white justify-between flex rounded-md font-medium p-1 px-3 select-none shadow-sm')} data-testid="column-title">
                <span className={textColor}>{column.title}</span>
                <div className={cn('text-xs p-1 text-white py-0 rounded-md select-none grid', bgColor)}>
                    <span className="m-auto">{column.jobs.length}</span>
                </div>
            </h2>
        </header>
    )
}

export default function KanbanColumnCmp({ column, openEditSheet, openDeleteDialog, KanbanCard = DefaultKanbanCard }: KanbanColumnProps) {
    return (
        <div className="min-w-[220px] flex-1 bg-gray-100 overflow-hidden" data-testid="kanban-column">
            <ColumnHeaders column={column} />
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        className={cn(
                            'flex flex-col rounded-sm p-2 pb-14 overflow-auto h-full gap-2 min-h-[100px] transition-colors duration-0',
                            snapshot.isDraggingOver && 'bg-gray-200'
                        )}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {column.jobs.map((job, index) => {
                            return (
                                <KanbanCard
                                    key={job.id}
                                    job={job}
                                    index={index}
                                    openDeleteDialog={openDeleteDialog}
                                    openEditSheet={openEditSheet}
                                />
                            )
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
