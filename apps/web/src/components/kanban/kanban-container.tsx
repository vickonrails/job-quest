import { DragDropContext, type OnDragEndResponder } from '@hello-pangea/dnd';
import { type Job } from '@lib/types';
import { transformJobs } from '@utils/transform-to-column';
import { useKanbanColumns } from 'src/hooks/useKanbanColumns';
import { getInvolvedColumns } from './core/getInvolvedColumns';
import { getMovingItemData } from './core/getMovingItemData';
import KanbanCol, { type KanbanCardProps } from './kanban-column';

interface KanbanContainerProps {
    jobs: Job[],
    onUpdateStart: () => void,
    onUpdateEnd: () => void,
    openEditSheet?: (job?: Job) => void
    openDeleteDialog?: (job: Job) => void
    KanbanCard?: React.ComponentType<KanbanCardProps>
}

export default function JobsKanban({
    jobs,
    onUpdateStart,
    onUpdateEnd,
    KanbanCard,
    openEditSheet,
    openDeleteDialog
}: KanbanContainerProps) {

    const jobColumns = transformJobs(jobs)
    const { columns, updateMovedItem } = useKanbanColumns(jobColumns);

    const onDragEnd: OnDragEndResponder = (result) => {
        const involvedColumns = getInvolvedColumns(columns, result);
        if (!involvedColumns) return;
        const movingItemData = getMovingItemData(result, involvedColumns);

        onUpdateStart && onUpdateStart();
        updateMovedItem(movingItemData, involvedColumns).then(() => {
            // handle success state
        }).catch(() => {
            // handle error state
            // reload back to previous state
        }).finally(() => {
            onUpdateEnd && onUpdateEnd();
        });
    }

    return (
        <div className="flex px-4 flex-1 gap-2 overflow-x-auto" data-testid="kanban-container">
            <DragDropContext onDragEnd={onDragEnd}>
                {columns.map((column) => (
                    <KanbanCol
                        key={column.id}
                        column={column}
                        openDeleteDialog={openDeleteDialog}
                        openEditSheet={openEditSheet}
                        KanbanCard={KanbanCard}
                    />
                ))}
            </DragDropContext>
        </div>
    )
}