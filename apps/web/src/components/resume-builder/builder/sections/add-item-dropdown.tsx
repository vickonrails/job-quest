import { Education, type Project, type WorkExperience } from 'lib/types'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from 'ui/dropdown-menu'
import { DateRenderer } from '../../date-renderer'
import { AddSectionBtn } from './add-section-button'
import { formatDate } from 'shared'

interface AddItemDropdownProps<T> {
    title: string
    items: T[]
    onAddItem: (item: T) => void
    onAddBlank: () => void
}

/**
 * Add Work Experience Dropdown
 */

export function AddExperienceItemDropdown({ title, items, onAddItem, onAddBlank }: AddItemDropdownProps<WorkExperience>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <AddSectionBtn>{title}</AddSectionBtn>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-72">
                <DropdownMenuLabel>From your profile</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {items.map(experience => {
                        const { job_title } = experience
                        return (
                            <DropdownMenuItem onClick={() => onAddItem(experience)} key={experience.id}>
                                {job_title}
                                <p className="text-sm text-muted-foreground flex gap-1">
                                    <span>{experience.company_name}</span>
                                    <span><DateRenderer startDate={experience.start_date} endDate={experience.end_date ?? ''} /></span>
                                </p>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuGroup>
                <DropdownMenuItem onClick={onAddBlank}>
                    <p>Add Blank</p>
                    <p className="text-sm text-muted-foreground">Add from scratch</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


/**
 * Add Projects Dropdown
 */
export function AddProjectItemDropdown({ title, items, onAddItem, onAddBlank }: AddItemDropdownProps<Project>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <AddSectionBtn>{title}</AddSectionBtn>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-72">
                <DropdownMenuLabel>From your profile</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {items.map(project => {
                        const { title, start_date, end_date } = project
                        const endDate = end_date ? formatDate(end_date) : 'Now'
                        return (
                            <DropdownMenuItem onClick={() => onAddItem(project)} key={project.id}>
                                {title}
                                <p className="text-sm text-muted-foreground flex gap-1">
                                    <p className="font-medium">{title}</p>
                                    {start_date && <p className="text-sm text-muted-foreground">{formatDate(start_date)} - {endDate}</p>}
                                </p>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuGroup>
                <DropdownMenuItem onClick={onAddBlank}>
                    <p>Add Blank</p>
                    <p className="text-sm text-muted-foreground">Add from scratch</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

/**
 * Add Education Item Dropdown
 */
export function AddEducationItemDropdown({ title, items, onAddItem, onAddBlank }: AddItemDropdownProps<Education>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <AddSectionBtn>{title}</AddSectionBtn>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-72">
                <DropdownMenuLabel>From your profile</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {items.map(education => {
                        const { start_date, end_date, institution, field_of_study } = education
                        const endDate = end_date ? formatDate(end_date) : 'Now'
                        return (
                            <DropdownMenuItem onClick={() => onAddItem(education)} key={education.id}>
                                <p className="font-medium">{institution} - {field_of_study}</p>
                                <p className="text-sm text-muted-foreground">{formatDate(start_date)} - {endDate}</p>
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuGroup>
                <DropdownMenuItem onClick={onAddBlank}>
                    <p>Add Blank</p>
                    <p className="text-sm text-muted-foreground">Add from scratch</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}