import { type DropResult } from '@hello-pangea/dnd';
import { type InvolvedColumns } from './getInvolvedColumns';

const ORDER_DISTANCE = 0.5;

export function getMovingItemData(result: DropResult, involvedColumn: InvolvedColumns) {
    let movingItemOrder = 0;

    if (!involvedColumn) return;

    const { destination, source } = result
    if (!destination) return;

    const { start, finish } = involvedColumn;
    const sameColumn = start.id === finish.id;

    const sourceJobs = Array.from(involvedColumn.start.jobs) || [];
    const destinationJobs = Array.from(involvedColumn.finish.jobs);

    // source cannot be empty, but destination can be empty
    if (sourceJobs.length === 0) return;

    const movingItem = sameColumn ? sourceJobs[source.index] : sourceJobs.splice(source.index, 1)[0];

    if (!movingItem) return;

    if (sameColumn) {
        const downwards = destination.index < source.index;
        if (destination.index === 0 && sourceJobs.length > 0) {
            const firstItemOrder = sourceJobs[0] && sourceJobs[0].order_column;
            if (!firstItemOrder) return;
            movingItemOrder = firstItemOrder - ORDER_DISTANCE;
        } else if ((destination.index === sourceJobs.length - 1) && sourceJobs.length > 0) {
            const lastIndex = sourceJobs.length - 1;
            const lastItemOrder = sourceJobs[lastIndex] && sourceJobs[lastIndex]?.order_column
            if (!lastItemOrder) return;
            movingItemOrder = lastItemOrder + ORDER_DISTANCE;
        } else {
            const beforeItem = sourceJobs[downwards ? destination.index - 1 : destination.index];
            const afterItem = sourceJobs[downwards ? destination.index : destination.index + 1];
            if (!beforeItem?.order_column || afterItem?.order_column === null) return;
            if (typeof afterItem?.order_column !== 'number') return;
            movingItemOrder = (afterItem?.order_column + beforeItem?.order_column) / 2;
        }

    } else {
        if (destination.index === 0) {
            // if we're replacing the item in the first index, remove 0.5 from the index of the first item
            const newItemOrder = destinationJobs[0]?.order_column || 0;
            movingItemOrder = newItemOrder - ORDER_DISTANCE;
        } else if (destination.index === 0 && destinationJobs.length === 0) {
            // case where the destination is empty
            movingItemOrder = 1;
        } else if (destination.index === destinationJobs.length) {
            const lastIndex = destinationJobs.length - 1
            const lastItemOrder = destinationJobs[lastIndex]?.order_column;
            if (!lastItemOrder) return;
            movingItemOrder = lastItemOrder + ORDER_DISTANCE;
        } else {
            const beforeItem = destinationJobs[destination.index - 1];
            const afterItem = destinationJobs[destination.index];
            if (!beforeItem?.order_column || afterItem?.order_column == null) return;
            movingItemOrder = (afterItem?.order_column + beforeItem?.order_column) / 2;
        }

        movingItem.status = finish.columnStatus;
        destinationJobs.push(movingItem);
    }

    movingItem.order_column = movingItemOrder;
    return {
        sourceJobs,
        destinationJobs,
        movingItem
    }
}