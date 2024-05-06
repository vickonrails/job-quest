import React from 'react'
import { describe } from 'vitest'
import { cleanup, render } from '@testing-library/react'
import { DatePicker } from '../src/components/date-picker'

describe('Date Picker', () => {

    function setup() {
        return render(<DatePicker />)
    }

    afterEach(() => {
        cleanup()
    })


    it('Date picker trigger component renders without crashing', async () => {
        const { getByRole } = setup()
        // expect(getByRole('input', {name: ''})).toBeInTheDocument();
        // expect(getByTestId('date-picker-input')).toBeInTheDocument();
        // expect(getByTestId('date-picker-trigger')).toBeInTheDocument();

        // console.log(await findByTestId('date-picker-popover'))
        // expect(findByTestId('date-picker-popover')).toBeInTheDocument();
    })
    // clicking on trigger opens the calendar popover
    // date picker and input field are empty if no default value is provided
    // date picker and input field render with correct default Value
    // clicking on a date in the popover sets the current date and updates the input field
    // entering a date in the input updates the date picker popover
    // clearing date in the input field removes it from the date picker component
    // Test that typing in an invalid date does not update the date picker component
    // Test that minimum and maximum dates cannot be selected in the date picker
    // Test that both components can be navigated by the keyboard
});