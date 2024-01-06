
import { type Job } from '@lib/types';
import { v4 as uuid } from 'uuid';

export enum ApplicationStatus {
    Bookmarked,
    Applying,
    Applied,
    Interviewing,
    Negotiating,
    Hired,
    Rejected,
}

export interface KanbanColumn {
    id: string,
    title: string,
    columnStatus: ApplicationStatus,
    jobs: Job[]
}

export function sortByOrder(a: Job, b: Job) {
    if (a.order_column === undefined || a.order_column === null) return 1;
    if (b.order_column === undefined || b.order_column === null) return -1;

    const orderA = Number(a.order_column);
    const orderB = Number(b.order_column);

    return orderA - orderB;
}


export function transformJobs(jobs: Job[]) {

    const kanbanColumns: KanbanColumn[] = [
        {
            id: uuid(),
            title: 'Bookmarked',
            columnStatus: ApplicationStatus.Bookmarked,
            jobs: [],
        },
        {
            id: uuid(),
            title: 'Applying',
            columnStatus: ApplicationStatus.Applying,
            jobs: []
        },
        {
            id: uuid(),
            title: 'Applied',
            columnStatus: ApplicationStatus.Applied,
            jobs: []
        },
        {
            id: uuid(),
            title: 'Interviewing',
            columnStatus: ApplicationStatus.Interviewing,
            jobs: []
        },
        {
            id: uuid(),
            title: 'Negotiating',
            columnStatus: ApplicationStatus.Negotiating,
            jobs: []
        },
        // {
        //     id: uuid(),
        //     title: 'Hired',
        //     columnStatus: ApplicationStatus.Interviewing,
        //     jobs: []
        // },
        // {
        //     id: uuid(),
        //     title: 'Rejected',
        //     columnStatus: ApplicationStatus.Rejected,
        //     jobs: []
        // }
    ] as const

    jobs.sort(sortByOrder).forEach(job => {
        const colIndex = job.status || 0;
        if (!kanbanColumns) return;
        kanbanColumns?.[colIndex]?.jobs.push(job)
    });

    return kanbanColumns
}