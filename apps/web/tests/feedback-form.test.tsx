import { Feedback } from '@/components/feedback/feedback-popover';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
// import { FeedbackButton } from '../src/components/feedback-widget';

describe('Feedback Form', () => {
    afterEach(() => {
        cleanup();
    })

    const setup = () => {
        return {
            user: userEvent.setup(),
            ...render(<Feedback />)
        }
    }

    it('renders button without errors & clicking opens the feedback dialog', async () => {
        const { getByTestId, user, getByText, getByRole } = setup()
        const button = getByRole('button', { name: 'Feedback' })
        expect(button).toBeInTheDocument()
        await user.click(button);

        const form = getByTestId('feedback-form')
        expect(form).toBeInTheDocument();

        expect(getByRole('textbox')).toBeInTheDocument();
        expect(getByRole('combobox')).toBeInTheDocument();
        expect(getByText('Send')).toBeInTheDocument();
    })

    it('Feedback form is disabled until fields are filled', async () => {
        const { getByText, getByRole, user } = setup()
        const button = getByText('Feedback')
        fireEvent.click(button);

        const submitBtn = getByText('Send')
        expect(submitBtn).toBeDisabled();

        const reasonSelect = getByRole('combobox');
        const feedbackTextarea = getByRole('textbox')

        await user.type(feedbackTextarea, 'Helpful feedback');
        await user.click(reasonSelect);

        expect(getByRole('option', { name: 'Improvement' })).toBeInTheDocument()
        expect(getByRole('option', { name: 'Bug report' })).toBeInTheDocument()
        expect(getByRole('option', { name: 'Feature request' })).toBeInTheDocument()

        await user.click(getByRole('option', { name: 'Improvement' }))
        expect(submitBtn).not.toBeDisabled();
    })
});