import { ApplicationStatus, type KanbanColumn } from '@utils/transform-to-column'

export function getColumnHeaderProps(column: KanbanColumn) {
    switch (column.columnStatus) {
        case ApplicationStatus.Bookmarked:
        default:
            return { textColor: 'text-blue-500', bgColor: 'bg-blue-500' }
        case ApplicationStatus.Applying:
            return { textColor: 'text-yellow-500', bgColor: 'bg-yellow-500' }
        case ApplicationStatus.Applied:
            return { textColor: 'text-green-500', bgColor: 'bg-green-500' }
        case ApplicationStatus.Interviewing:
            return { textColor: 'text-purple-500', bgColor: 'bg-purple-500' }
        case ApplicationStatus.Negotiating:
            return { textColor: 'text-pink-500', bgColor: 'bg-pink-500' }
        case ApplicationStatus.Hired:
            return { textColor: 'text-green-500', bgColor: 'bg-green-500' }
        case ApplicationStatus.Rejected:
            return { textColor: 'text-red-500', bgColor: 'bg-red-500' }
    }
}
