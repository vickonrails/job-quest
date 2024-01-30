import { AlertDialog } from '@components/alert-dialog'
import { MenuBar, MenuItem, Separator } from '@components/menubar'
import { JobEditSheet } from '@components/sheet/jobsEditSheet'
import { Draggable } from '@hello-pangea/dnd'
import { type Job } from 'lib/types'
import { ExternalLink, FileText, PanelRightClose, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { MoreVertical } from 'react-feather'
import { useDeleteModal } from 'src/hooks/useDeleteModal'
import { useEditSheet } from 'src/hooks/useEditModal'
import { Button, Rating } from 'ui'

export default function KanbanCard({ job, index, openEditSheet }: { job: Job, index: number, openEditSheet: (job?: Job) => void }) {
    const router = useRouter()
    const {
        showDeleteDialog,
        isOpen: deleteModalOpen,
        onCancel,
        handleDelete,
        setIsOpen: setIsDeleteModalOpen,
        loading: isDeleting
    } = useDeleteModal({})
    // const { isOpen: editSheetOpen, showEditSheet, setIsOpen, selectedEntity } = useEditSheet({})

    const navigateToJob = (job: Job) => {
        return router.push(`/jobs/${job.id}`);
    }

    return (
        <>
            <Draggable draggableId={job.id} index={index}>
                {(provided) => (
                    <article
                        onClick={() => openEditSheet?.(job)}
                        data-testid="kanban-card"
                        className="flex flex-col border-1 border p-3 rounded-md select-none bg-white items-start group"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps.style}
                    >
                        <div className="flex justify-between w-full">
                            <div className="flex gap-1 items-center mb-1">
                                {job.company_site && <Image width={20} height={20} src={`https://logo.clearbit.com/${job.company_site}`} alt="" />}
                                <p className="text-sm text-gray-600">{job.company_name}</p>
                            </div>

                            <MenuBar
                                triggerProps={{ className: 'data-[state=open]:outline rounded-sm outline-gray-300' }}
                                contentProps={{ side: 'bottom', align: 'end' }}
                                trigger={<MoreVertical size={16} />}
                                onClick={e => e.stopPropagation()}
                                className="transition-opacity opacity-0 group-hover:opacity-100"
                            >
                                <MenuItem
                                    icon={<PanelRightClose size={16} />}
                                    onClick={() => openEditSheet?.(job)}
                                >
                                    Quick View
                                </MenuItem>
                                <MenuItem
                                    icon={<FileText size={16} />}
                                    onClick={() => navigateToJob?.(job)}
                                >
                                    Detailed View
                                </MenuItem>
                                <Separator />
                                <MenuItem
                                    className="text-red-400 hover:bg-red-50"
                                    icon={<Trash2 size={16} />}
                                    onClick={_ => showDeleteDialog(job)}
                                >
                                    Delete
                                </MenuItem>
                            </MenuBar>
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

            <AlertDialog
                open={deleteModalOpen}
                title="Delete Confirmation"
                description="Are you sure you want to delete this job?"
                onOk={handleDelete}
                // TODO: figure out why this isn't working
                onOpenChange={setIsDeleteModalOpen}
                onCancel={onCancel}
                isProcessing={isDeleting}
            />
        </>
    )
}
