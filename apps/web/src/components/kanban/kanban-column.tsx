import { type KanbanColumn } from '@/utils/transform-to-column';
import { Droppable } from '@hello-pangea/dnd';
import { type Job } from 'lib/types';
import { cn } from 'shared';
import { getColumnHeaderProps } from './core/getHeaderProperties';
import { KanbanCard as DefaultKanbanCard } from './kanban-card';

export interface KanbanCardProps {
    job: Job
    index: number
    openEditSheet?: (job?: Job) => void
    openDeleteDialog?: (job: Job) => void
    className?: string
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
        <header className="flex justify-between items-center sticky top-0 p-2 py-3 pb-0 mb-2">
            <h2 className={cn('text-sm w-full text-muted justify-between flex font-medium p-1 select-none')} data-testid="column-title">
                <span className="text-secondary-foreground" /*className={textColor}*/>{column.title}</span>
                <div className={cn('text-xs p-1 text-white py-0 rounded-sm select-none grid', bgColor)}>
                    <span className="m-auto">{column.jobs.length}</span>
                </div>
            </h2>
        </header>
    )
}

export default function KanbanColumnCmp({ column, openEditSheet, openDeleteDialog, KanbanCard = DefaultKanbanCard }: KanbanColumnProps) {
    return (
        <div className="min-w-[220px] h-full flex-1 bg-kanban-col overflow-hidden rounded-sm" data-testid="kanban-column">
            <ColumnHeaders column={column} />
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        className={cn(
                            'flex flex-col p-2 pb-14 overflow-auto h-full gap-2 min-h-[100px] transition-colors duration-0',
                            snapshot.isDraggingOver && 'bg-kanban-col'
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
