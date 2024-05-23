import React from 'react'
import { describe } from 'vitest'
import { JobDetails } from '../src/components/job-details/job-details'
import { cleanup, render } from '@testing-library/react'
import { JobInsertDTO, type Job } from '../lib/types'
import userEvent from '@testing-library/user-event'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTestQueryClient } from '../vitest/setup'
import { job } from './utils'

const testClient = createTestQueryClient();

describe('Job Details', () => {
    afterEach(() => {
        cleanup();
    })

    const setup = ({ job }: { job: JobInsertDTO }) => {
        return render(
            <QueryClientProvider client={testClient}>
                <JobDetails job={job as Job} />
            </QueryClientProvider>
        )
    }

    describe('Job details - Header', () => {
        it(' job header is rendered correctly', () => {
            const { getByText } = setup({ job });

            expect(getByText('Google')).toBeInTheDocument();
            expect(getByText('Go')).toBeInTheDocument();
            expect(getByText('Senior Software Engineer')).toBeInTheDocument();
            expect(getByText('Applying')).toBeInTheDocument();
        })
    })

    describe('Job details - Keywords', () => {
        it('job is first rendered without keywords, clicking generate keywords', () => {
            const { getByText } = setup({ job })
            expect(getByText('Relevant Keywords')).toBeInTheDocument();
            expect(getByText('Generate Keywords')).toBeInTheDocument();
            expect(getByText(job.description ?? '')).toBeInTheDocument()
        })
    })

    describe('Job description - Other sections', () => {
        it('renders resume section', () => {
            const { getByRole } = setup({ job })
            expect(getByRole('heading', { name: 'Add Resume' })).toBeInTheDocument()
            expect(getByRole('heading', { name: 'Add Cover Letter' })).toBeInTheDocument()
        })
    })

    describe('Job Details - Notes', () => {
        it('Not form is disabled when text is empty', async () => {
            const { getByRole, getByText } = setup({ job })
            const notesTextarea = getByRole('textbox')
            const submitButton = getByText('Add notes');

            expect(submitButton).toBeDisabled()
            expect(notesTextarea).toBeInTheDocument();
            await userEvent.type(notesTextarea, 'Hello world')
            expect(submitButton).not.toBeDisabled()
        })
    })
})