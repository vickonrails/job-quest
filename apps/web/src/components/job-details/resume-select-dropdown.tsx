import { type Resume } from 'lib/types'
import { Button } from 'ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from 'ui/dropdown-menu'

export function ResumeSelectDropdown({ isUpdating, resumes, onClickNew, attachResume }: { isUpdating: boolean, onClickNew: () => void, attachResume: (resumeId: string) => Promise<void>, resumes: Resume[] }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" loading={isUpdating}>Update Resume</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="bottom" align="start">
                <DropdownMenuLabel className="text-muted-foreground">Resumes</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {resumes.map(resume => (
                    <DropdownMenuGroup key={resume.id}>
                        <DropdownMenuItem onClick={() => attachResume(resume.id)}>{resume.title}</DropdownMenuItem>
                    </DropdownMenuGroup>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onClickNew}>
                    Create New
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
