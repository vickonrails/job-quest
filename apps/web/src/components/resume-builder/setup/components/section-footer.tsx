import { Button } from 'ui';

// ---------------------- Form Footer ---------------------- // 
interface SectionFooterProps {
    saveDisabled: boolean;
    isSubmitting: boolean;
    onAppendClick: () => void;
    addText?: string
}

export function SectionFooter({ addText, saveDisabled, isSubmitting, onAppendClick }: SectionFooterProps) {
    return (
        <div className="flex gap-2">
            <Button
                className="text-primary hover:text-primary"
                type="button"
                variant="outline"
                onClick={onAppendClick}
            >
                {addText ?? 'Add'}
            </Button>
            <Button loading={isSubmitting} disabled={saveDisabled}>Save & Proceed</Button>
        </div>
    )
}