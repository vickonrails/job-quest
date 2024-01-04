import { type DropResult } from '@hello-pangea/dnd';
import { type KanbanColumn } from '@utils/transform-to-column';

const ORDER_DISTANCE = 0.5;

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

///

export type InvolvedColumns = ReturnType<typeof getInvolvedColumns>

export function getMovingItem(result: DropResult, involvedColumn: NonNullable<InvolvedColumns>) {
    let movingItemOrder = 0;

    const { destination, source } = result
    if (!destination) return;

    const { start, finish } = involvedColumn;
    const sameColumn = start.id === finish.id;

    const sourceJobs = Array.from(involvedColumn.start.jobs);
    const destinationJobs = Array.from(involvedColumn.finish.jobs);

    const movingItem = sameColumn ? sourceJobs[source.index] : sourceJobs.splice(source.index, 1)[0];

    if (!movingItem) return;

    if (sameColumn) {
        const downwards = destination.index < source.index;
        if (destination.index === 0) {
            movingItemOrder = sourceJobs[0].order_column - ORDER_DISTANCE;
        } else if (destination.index === sourceJobs.length - 1) {
            movingItemOrder = sourceJobs[sourceJobs.length - 1].order_column + ORDER_DISTANCE;
        } else {
            const beforeItem = sourceJobs[downwards ? destination.index - 1 : destination.index];
            const afterItem = sourceJobs[downwards ? destination.index : destination.index + 1];
            if (!beforeItem?.order_column || afterItem?.order_column === null) return;
            movingItemOrder = (afterItem?.order_column + beforeItem?.order_column) / 2;
        }

    } else {
        if (destination.index === 0) {
            const newItemOrder = destinationJobs[0]?.order_column || 0;
            movingItemOrder = newItemOrder - ORDER_DISTANCE;
        } else if (destination.index === destinationJobs.length) {
            movingItemOrder = destinationJobs[destinationJobs.length - 1].order_column + ORDER_DISTANCE;
        } else {
            const beforeItem = destinationJobs[destination.index - 1];
            const afterItem = destinationJobs[destination.index];
            if (!beforeItem?.order_column || afterItem?.order_column == null) return;
            movingItemOrder = (afterItem?.order_column + beforeItem?.order_column) / 2;
        }

        destinationJobs.push(movingItem);
    }

    movingItem.order_column = movingItemOrder;
    return {
        sourceJobs,
        destinationJobs,
        movingItem
    }
}