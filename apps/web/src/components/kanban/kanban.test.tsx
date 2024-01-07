import { type DropResult } from '@hello-pangea/dnd';
import { type Job } from '@lib/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render } from '@testing-library/react';
import jobs from '@utils/jobs';
import { transformJobs } from '@utils/transform-to-column';
import { getInvolvedColumns } from './core/getInvolvedColumns';
import JobsKanban from './kanban-container';
import { getMovingItemData } from './core/getMovingItemData';

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
})

describe('Kanban', () => {
    const testClient = createTestQueryClient()

    afterEach(() => {
        testClient.clear();
        cleanup()
    });


    describe('getInvolvedColumns', () => {
        // a mock DropResult for moving an item from Applied to Interviewing
        // this is possible because the ID is a literal in transform-to-column.ts
        const columns = transformJobs(jobs as Job[]);

        it('returns correct involved columns', () => {
            const result: DropResult = {
                combine: null,
                destination: { droppableId: 'cb3cc2fa-b9d7-4913-87bc-7849f23a16dc', index: 0 },
                source: { index: 0, droppableId: '29746c2a-98e3-4045-9911-b68af838c8bd' },
                draggableId: '156e6eee-d897-49d4-80f9-7c1aedc714ad',
                mode: 'FLUID',
                reason: 'DROP',
                type: 'DEFAULT'
            }
            const involvedColumns = getInvolvedColumns(columns, result);

            expect(involvedColumns).toHaveProperty('start');
            expect(involvedColumns).toHaveProperty('finish');
            expect(involvedColumns?.start.title).toBe('Applied');
            expect(involvedColumns?.finish.title).toBe('Interviewing');
        });

        // case of where we pick up a card but drop it back on the same spot
        it('returns null when dropped back from source', () => {
            const result: DropResult = {
                combine: null,
                destination: { droppableId: 'cb3cc2fa-b9d7-4913-87bc-7849f23a16dc', index: 0 },
                source: { droppableId: 'cb3cc2fa-b9d7-4913-87bc-7849f23a16dc', index: 0 },
                draggableId: '156e6eee-d897-49d4-80f9-7c1aedc714ad',
                mode: 'FLUID',
                reason: 'DROP',
                type: 'DEFAULT'
            }
            const involvedColumns = getInvolvedColumns(columns, result);
            expect(involvedColumns).toBeFalsy();
        })

        it('returns null when passed wrong dropResult', () => {
            const result = {
                combine: null,
                destination: {},
                source: {},
                draggableId: '156e6eee-d897-49d4-80f9-7c1aedc714ad',
                mode: 'FLUID',
                reason: 'DROP',
                type: 'DEFAULT'
            } as DropResult;
            const involvedColumns = getInvolvedColumns(columns, result);
            expect(involvedColumns).toBeFalsy();
        })
    })

    describe('getMovingItemData', () => {

        it('return moving item with new order_column', () => {
            // the test is simulating moving the first item in the Applied column to the second position
            // we expect the new moving item to have an order_column of 2.5
            // because beforeItem has order_column of 2 and afterItem has order_column of 3
            // finding the average of the next 2 items 2 + 3 / 2 = 2.5
            const result: DropResult = {
                combine: null,
                destination: { droppableId: '29746c2a-98e3-4045-9911-b68af838c8bd', index: 1 },
                source: { index: 0, droppableId: '29746c2a-98e3-4045-9911-b68af838c8bd' },
                draggableId: '156e6eee-d897-49d4-80f9-7c1aedc715ad',
                mode: 'FLUID',
                reason: 'DROP',
                type: 'DEFAULT'
            }
            const columns = transformJobs(jobs as Job[])
            const involvedColumns = getInvolvedColumns(columns, result);
            const movingItemData = getMovingItemData(result, involvedColumns);
            const movingItem = movingItemData?.movingItem;

            expect(movingItem?.order_column).toBe(2.5);
        })

        // moving from applying (index: 0) to interviewing (index: 1)
        it('moving item to a new column gets new status & order_column', () => {
            const result: DropResult = {
                combine: null,
                destination: { droppableId: 'cb3cc2fa-b9d7-4913-87bc-7849f23a16dc', index: 1 },
                source: { index: 0, droppableId: '29746c2a-98e3-4045-9911-b68af838c8bd' },
                draggableId: '156e6eee-d897-49d4-80f9-7c1aedc714ad',
                mode: 'FLUID',
                reason: 'DROP',
                type: 'DEFAULT'
            }
            const columns = transformJobs(jobs as Job[])
            const involvedColumns = getInvolvedColumns(columns, result);
            const movingItemData = getMovingItemData(result, involvedColumns);
            const movingItem = movingItemData?.movingItem;

            // the status of the new column is 3 (interviewing)
            expect(movingItem?.status).toBe(3);
            // the destination column contains the newly moved item
            // the seed data had just 7 items in the interviewing column
            expect(movingItemData?.destinationJobs).toHaveLength(8);
            // the order_column of the new item is 1.5
            expect(movingItem?.order_column).toBe(1.5);
        })
    });

    describe('transformJobs', () => {
        const columns = transformJobs(jobs as Job[]);
        it('transformJobs returns correct number of columns', () => {
            expect(columns).toHaveLength(5)
        });

        it('renders the correct number of jobs per column', () => {
            expect(columns[0]?.jobs.length).toBe(1);
            expect(columns[1]?.jobs.length).toBe(2);
            expect(columns[2]?.jobs.length).toBe(5);
            expect(columns[3]?.jobs.length).toBe(7);
            expect(columns[4]?.jobs.length).toBe(5);
        });
    })

    const setup = () => {
        return render(
            <QueryClientProvider client={testClient}>
                <JobsKanban
                    jobs={jobs as Job[]}
                    onUpdateEnd={() => {/** */ }}
                    onUpdateStart={() => {/** */ }}
                />
            </QueryClientProvider>
        )
    }

    it('renders all children without crashing', () => {
        const { getByTestId, getAllByTestId } = setup();
        expect(getByTestId('kanban-container')).toBeInTheDocument();
        expect(getAllByTestId('kanban-column')).toHaveLength(5);
        expect(getAllByTestId('kanban-card')).toHaveLength(20);
    });

    it('renders column titles', () => {
        const { getAllByTestId } = setup();
        expect(getAllByTestId('column-title')).toHaveLength(5);
    })
})