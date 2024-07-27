import { MoreVertical, Trash } from 'lucide-react'
import { Button } from 'ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from 'ui/dropdown-menu'

export function KanbanCardDropdownMenu({ onQuickViewClick, onDeleteClick, onDetailedViewClick }: { onQuickViewClick: () => void, onDetailedViewClick: () => void, onDeleteClick: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="p-0 h-auto w-auto transition-opacity opacity-0 group-hover:opacity-100 active:opacity-100">
                    <MoreVertical size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="bottom" onClick={ev => ev.stopPropagation()}>
                <DropdownMenuItem onClick={onQuickViewClick}>Quick View</DropdownMenuItem>
                <DropdownMenuItem onClick={onDetailedViewClick}>Detailed View</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    className="flex-row gap-1 items-center"
                    onClick={onDeleteClick}
                >
                    <Trash size={16} />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
