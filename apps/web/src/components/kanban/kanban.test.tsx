import { type Job } from '@lib/types';
import { cleanup, render } from '@testing-library/react';
import jobs from '@utils/jobs';
import { transformJobs } from '@utils/transform-to-column';
import JobsKanban from './kanban-container';

const columns = transformJobs(jobs as Job[])

describe('Kanban', () => {
    afterEach(() => {
        cleanup()
    });

    const setup = () => {
        return render(
            <JobsKanban jobColumns={columns} />
        )
    }

    it('transformJobs returns correct number of columns', () => {
        expect(columns).toHaveLength(5)
    });

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

    it('renders the correct number of jobs per column', () => {
        expect(columns[0]?.jobs.length).toBe(1);
        expect(columns[1]?.jobs.length).toBe(2);
        expect(columns[2]?.jobs.length).toBe(5);
        expect(columns[3]?.jobs.length).toBe(7);
        expect(columns[4]?.jobs.length).toBe(5);
    });
})