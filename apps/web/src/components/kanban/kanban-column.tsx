import { Droppable } from '@hello-pangea/dnd';
import { cn } from '@utils/cn';
import { type KanbanColumn } from '@utils/transform-to-column';
import KanbanCard from './kanban-card';

export default function KanbanColumnCmp({ column }: { column: KanbanColumn }) {
    return (
        <div className="flex-1">
            <header className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-medium p-1  inline-block">{column.title}</h2>
                <p className="text-sm bg-gray-100 p-1 py-0 rounded-sm">{column.jobs.length}</p>
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
                                <KanbanCard key={job.id} job={job} index={index} />
                            )
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    )
}
