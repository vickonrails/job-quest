import { FileWarning } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from 'ui/alert';

/**
 * show errors from the import
 * TODO: fix to provide a more human-friendly error
 */
export function UploadErrorHint({ errors }: { errors: { path: string, message: string }[] }) {
    return (
        <Alert className="bg-accent text-sm text-accent-foreground border-destructive mb-4">
            <FileWarning size={18} />
            <AlertTitle>Invalid import data</AlertTitle>
            {errors.map(err => (
                <AlertDescription key={err.path} className="text-muted-foreground">
                    {err.message} in {err.path}
                </AlertDescription>
            ))}
        </Alert>
    )
}