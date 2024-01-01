import { Draggable } from '@hello-pangea/dnd'
import { type Job } from 'lib/types'
import Image from 'next/image'
import { Rating } from 'ui'

export default function KanbanCard({ job, index }: { job: Job, index: number }) {
    return (
        <Draggable draggableId={job.id} index={index}>
            {(provided) => (
                <article
                    className="flex flex-col border-1 border p-3 rounded-md select-none bg-white items-start"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    {...provided.draggableProps.style}
                >
                    <div className="flex gap-1 items-center mb-1">
                        {job.company_site && <Image width={20} height={20} src={`https://logo.clearbit.com/${job.company_site}`} alt="" />}
                        <p className="text-sm text-gray-600">{job.company_name}</p>
                    </div>
                    <div className="mb-2">
                        <h3 className="text-sm font-medium">{job.position}</h3>
                        <p className="text-sm text-gray-500">{job.location}</p>
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
