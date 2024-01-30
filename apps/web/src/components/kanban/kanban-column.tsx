import { Droppable } from '@hello-pangea/dnd';
import { type Job } from '@lib/types';
import { cn } from '@utils/cn';
import { type KanbanColumn } from '@utils/transform-to-column';
import KanbanCard from './kanban-card';

export default function KanbanColumnCmp({ column, openEditSheet }: { column: KanbanColumn, openEditSheet: (job?: Job) => void }) {
    return (
        <div className="flex-1" data-testid="kanban-column">
            <header className="flex justify-between items-center py-2 sticky top-0 bg-white">
                <h2 className="text-sm font-medium p-1 px-3 bg-gray-100 inline-block select-none" data-testid="column-title">{column.title}</h2>
                <p className="text-xs bg-gray-100 p-1 py-0 rounded-sm select-none">{column.jobs.length}</p>
            </header>
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <div
                        className={cn(
                            'flex flex-col rounded-sm p-2 bg-gray-100 h-full gap-2 min-h-[100px] transition-colors duration-0',
                            snapshot.isDraggingOver && 'bg-gray-200'
                        )}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {column.jobs.map((job, index) => {
                            return (
                                <KanbanCard key={job.id} job={job} index={index} openEditSheet={openEditSheet} />
                            )
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
