import React from 'react'
import { render } from '@testing-library/react'
import { describe } from 'vitest'
import { ResumePreviewCard } from '../src/components/resume-card'
import { type Resume } from '../lib/types'
import { formatDate } from 'shared'

const resume = {
    title: 'Senior Software Engineer',
    id: '156e6eee-d897-49d4-80f9-7c1aedc714ad',
    created_at: new Date().toString(),
} as Resume;

describe('Resume', () => {

    describe('Resume Card', () => {
        const { getByText, getByRole } = render(<ResumePreviewCard resume={resume} />)

        it('Renders correct data without error', () => {
            const formattedDate = formatDate(resume.created_at ?? '')
            expect(getByText('Senior Software Engineer')).toBeInTheDocument();
            expect(getByText(formattedDate)).toBeInTheDocument();
            expect(getByRole('link')).toHaveAttribute('href', '/resumes/156e6eee-d897-49d4-80f9-7c1aedc714ad')
        })
    })
})