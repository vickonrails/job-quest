import { Status_Lookup } from '@components/table/job/JobsTable'
import { formatDate } from '@components/utils'
import { type Note } from 'lib/types'
import React, { type HTMLAttributes } from 'react'
import { Trash } from 'react-feather'
import { cn } from '@utils/cn'

interface NoteItemProps extends HTMLAttributes<HTMLElement> {
    note: Note
    showDeleteDialog: (note: Note) => void
}

function NoteItem({ note, className, showDeleteDialog, ...rest }: NoteItemProps) {
    return (
        <article key={note.id} className={cn('p-3 cursor-pointer hover:bg-gray-100 group relative', className)} {...rest}>
            <p className="leading-tight text-sm mb-2 max-w-[17em]">{note.text}</p>
            <div className="flex justify-between">
                {note.created_at && <p className="text-sm text-gray-400">{formatDate(note.created_at)}</p>}
                <p className="text-sm text-gray-400">{Status_Lookup[note.status]}</p>
            </div>
            <button onClick={() => showDeleteDialog(note)} className="hidden group-hover:block absolute top-3 right-3">
                <Trash size={16} className="text-gray-700" />
            </button>
        </article>
    )
}

export default NoteItem