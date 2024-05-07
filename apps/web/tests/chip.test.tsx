import React from 'react'
import { describe } from 'vitest'
import { Chip, ChipsGroup } from '../src/components/chip'
import { render } from '@testing-library/react';

const onCloseClick = () => {
    // 
}

describe('Chip', () => {
    it('renders without any error', () => {
        const { getByTestId } = render(<Chip label="Hello world" />)
        expect(getByTestId('chip')).toBeInTheDocument();
    });

    it('Shows close button if specified', () => {
        const { getByLabelText } = render(<Chip label="Hello world" onCloseClick={onCloseClick} />)
        expect(getByLabelText('Remove')).toBeInTheDocument();
    })

    it('renders chip group without error', () => {
        const { getAllByTestId } = render(
            <ChipsGroup labels={[
                { label: 'Hello World', onCloseClick },
                { label: 'Hello World 2', onCloseClick },
            ]} />)

        expect(getAllByTestId('chip')).toHaveLength(2);
    })
});