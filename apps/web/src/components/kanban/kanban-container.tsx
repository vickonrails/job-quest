import { DragDropContext } from '@hello-pangea/dnd';
import KanbanCol from './kanban-column';
import { type KanbanColumn } from '@utils/transform-to-column';

export default function JobsKanban({ jobColumns }: { jobColumns: KanbanColumn[] }) {
    const onDragEnd = () => {
        // TODO: implement
    }

    return (
        <div className="flex w-full h-full gap-2">
            <DragDropContext onDragEnd={onDragEnd}>
                {jobColumns.map((column) => (
                    <KanbanCol key={column.id} column={column} />
                ))}
            </DragDropContext>
        </div>
    )
}
