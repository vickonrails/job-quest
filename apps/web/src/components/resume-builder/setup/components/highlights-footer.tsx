import { Trash2 } from 'lucide-react';
import { Button } from 'ui';

export function HighlightFooter({ onDeleteClick, addHighlight }: { onDeleteClick: () => void, addHighlight: () => void }) {
    return (
        <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={addHighlight}>
                Add Highlight
            </Button>
            <Button
                size="sm"
                className="text-red-400 flex items-center gap-1"
                type="button"
                variant="outline"
                onClick={onDeleteClick}
            >
                <Trash2 size={18} />
                <span>Remove Block</span>
            </Button>
        </div>
    )
}