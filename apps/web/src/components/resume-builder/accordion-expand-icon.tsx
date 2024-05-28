import { Minus, Plus } from 'lucide-react';

export function AccordionExpandIcon() {
    return (
        <>
            <Plus size={32} className="text-muted-foreground transition-colors group-hover:bg-muted p-2 rounded-md open-icon" />
            <Minus size={32} className="text-muted-foreground transition-colors group-hover:bg-muted p-2 rounded-md close-icon" />
        </>
    )
}