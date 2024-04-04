
import { type Job } from '@lib/types';

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

    return orderB - orderA;
}


export function transformJobs(jobs: Job[]) {

    // used uuid ids which caused some diff to be erratic. so for now, I'll just stick with adding the uuid directly here
    // is there any reason I shouldn't do that?
    // Also the tests for the kanban are heavily dependent on the id of the columns
    const kanbanColumns: KanbanColumn[] = [
        {
            id: 'dcd9707c-95f4-41ac-a527-29d062d7e680',
            title: 'Bookmarked',
            columnStatus: ApplicationStatus.Bookmarked,
            jobs: [],
        },
        {
            id: 'b1881d96-3d9e-4927-9136-a495de6bf528',
            title: 'Applying',
            columnStatus: ApplicationStatus.Applying,
            jobs: []
        },
        {
            id: '29746c2a-98e3-4045-9911-b68af838c8bd',
            title: 'Applied',
            columnStatus: ApplicationStatus.Applied,
            jobs: []
        },
        {
            id: 'cb3cc2fa-b9d7-4913-87bc-7849f23a16dc',
            title: 'Interviewing',
            columnStatus: ApplicationStatus.Interviewing,
            jobs: []
        },
        {
            id: '42db394c-0685-4636-89e3-e3675bec64f4',
            title: 'Negotiating',
            columnStatus: ApplicationStatus.Negotiating,
            jobs: []
        },
        {
            id: '65b1195d-fa82-4a9b-a28d-85cfdab0c6ef',
            title: 'Hired',
            columnStatus: ApplicationStatus.Interviewing,
            jobs: []
        },
        {
            id: '35632587-efc1-4b16-a6ef-01ea727a4c48',
            title: 'Rejected',
            columnStatus: ApplicationStatus.Rejected,
            jobs: []
        }
    ]

    jobs.sort(sortByOrder).forEach(job => {
        const colIndex = job.status || 0;
        kanbanColumns?.[colIndex]?.jobs.push(job)
    });

    return kanbanColumns
}