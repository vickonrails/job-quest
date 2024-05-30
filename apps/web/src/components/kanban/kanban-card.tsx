'use client'

import { Draggable } from '@hello-pangea/dnd'
import { type Job } from 'lib/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from 'shared'
import { Rating } from 'ui'
import { KanbanCardDropdownMenu } from './kanban-card-dropdown'
import { type KanbanCardProps } from './kanban-column'

export function KanbanCard({ job, index, openEditSheet, openDeleteDialog }: KanbanCardProps) {
    const router = useRouter()
    const onDetailedViewClick = () => {
        return router.push(`/jobs-tracker/${job.id}`);
    }
    const onQuickViewClick = () => {
        openEditSheet?.(job)
    }
    const onShowDeleteModal = () => {
        openDeleteDialog?.(job)
    }

    return (
        <Draggable draggableId={job.id} index={index}>
            {(provided) => (
                <article
                    onClick={() => openEditSheet?.(job)}
                    data-testid="kanban-card"
                    className={cn('flex flex-col bg-background p-3 rounded-md select-none items-start group')}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps.style}
                >
                    <div className="flex justify-between w-full">
                        <div className="flex gap-1 items-center mb-1">
                            {job.company_site && <Image width={20} height={20} src={`https://logo.clearbit.com/${job.company_site}`} alt="" />}
                            <p className="text-sm text-muted-foreground">{job.company_name}</p>
                        </div>
                        <KanbanCardDropdownMenu
                            onQuickViewClick={onQuickViewClick}
                            onDetailedViewClick={onDetailedViewClick}
                            onDeleteClick={onShowDeleteModal}
                        />
                    </div>
                    <div className="mb-2 text-sm">
                        <h3 className="font-medium">{job.position}</h3>
                        <p className="text-muted-foreground">{job.location}</p>
                    </div>
                    <Rating
                        size="sm"
                        value={job.priority || 0}
                    />
                </article>
            )}
        </Draggable>
    )
}
