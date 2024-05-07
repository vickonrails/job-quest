import React from 'react'
import { Dialog } from '../src/components/dialog'
import { AlertDialog } from '../src/components/alert-dialog'
import { render } from '@testing-library/react'

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
            <AlertDialog open={true} title="Dialog Test" description="Are you sure" />
        )

        expect(getByText('Dialog Test')).toBeInTheDocument()
        expect(getByText('Are you sure')).toBeInTheDocument()
        expect(getByText('Cancel')).toBeInTheDocument()
        expect(getByText('Delete')).toBeInTheDocument()
    })
})