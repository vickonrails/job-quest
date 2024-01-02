
import { type Job } from '@lib/types';
import { v4 as uuid } from 'uuid';

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

    // TODO: fix the typings here
    jobs.forEach(job => {
        const colIndex = job.status || 0;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        kanbanColumns[colIndex].jobs.push(job)
    });

    return kanbanColumns
}

export enum ApplicationStatus {
    Bookmarked = 'Bookmarked',
    Applying = 'Applying',
    Applied = 'Applied',
    Interviewing = 'Interviewing',
    Negotiating = 'Negotiating',
    Hired = 'Hired',
    Rejected = 'Rejected',
}


export interface KanbanColumn {
    id: string,
    title: string,
    columnStatus: ApplicationStatus,
    jobs: Job[]
}