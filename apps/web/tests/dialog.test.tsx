
import React from 'react'
import { render } from '@testing-library/react'
import { Dialog } from '@/components/dialog'
import { DeleteDialog } from '@/components/delete-dialog'

describe('Dialog', () => {
    it('renders without error', () => {
        const { getByText } = render(
            <Dialog open={true} title="Dialog Test">
                <p>Random Content</p>
            </Dialog>
        )

        expect(getByText('Dialog Test')).toBeInTheDocument()
        expect(getByText('Random Content')).toBeInTheDocument()
    })
})

describe('Alert Dialog', () => {
    it('renders without error', () => {
        const { getByText } = render(
            <DeleteDialog open={true} title="Dialog Test" description="Are you sure" />
        )

        expect(getByText('Dialog Test')).toBeInTheDocument()
        expect(getByText('Are you sure')).toBeInTheDocument()
        expect(getByText('Cancel')).toBeInTheDocument()
    })
})
