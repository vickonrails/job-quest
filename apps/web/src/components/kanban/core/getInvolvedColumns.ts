import { type DropResult } from '@hello-pangea/dnd';
import { type KanbanColumn } from '@utils/transform-to-column';

export type InvolvedColumns = ReturnType<typeof getInvolvedColumns>

export function getInvolvedColumns(columns: KanbanColumn[], { destination, source }: DropResult) {
    if (!destination || !source) return;
    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) return;

    const start = columns.find(col => col.id === source.droppableId);
    const finish = columns.find(col => col.id === destination.droppableId);

    if (!start || !finish) return;

    return {
        start,
        finish
    }
}