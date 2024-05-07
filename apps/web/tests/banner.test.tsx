import React from 'react'
import { describe } from 'vitest'
import { render } from '@testing-library/react'
import { Banner } from '../src/components/banner'

describe('Banner', () => {
    it('renders correct variant', () => {
        const { getByRole, getByText } = render(<Banner message="Hello World" />)
        expect(getByRole('banner')).toBeInTheDocument()
        expect(getByText('Hello World')).toBeInTheDocument()
    })
})