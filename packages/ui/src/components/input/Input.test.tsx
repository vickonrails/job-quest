import { Input, type InputProps } from "./Input"
import { type RenderResult, render, fireEvent, cleanup } from '@testing-library/react'
import { describe, expect, it } from "vitest";

describe("Input", () => {
    afterEach(() => {
        cleanup();
    });

    const setup = (props?: InputProps): RenderResult => {
        return render(<Input {...props} />);
    }

    it("renders without errors", () => {
        const { getByRole } = setup();
        expect(getByRole('textbox')).toBeInTheDocument();
    });

    it("hint is displayed", () => {
        const { getByTestId } = setup({ hint: 'test' });
        const hint = getByTestId('hint');
        expect(hint).toBeInTheDocument();
        expect(hint).toHaveTextContent('test');
    });

    it("renders appropriate size", () => {
        const arr: string[] = ['py-0.5', 'py-1.5', 'py-2.5', 'py-3.5']
        const { getAllByRole } = render(
            <>
                <Input size='xs' />
                <Input size='sm' />
                <Input size='md' />
                <Input size='lg' />
            </>
        )

        const inputs = getAllByRole('textbox');
        inputs.forEach((input, index) => {
            const cls = arr[index] as string
            expect(input).toHaveClass(cls);
        })
    });

    it("receives text input correctly", () => {
        const { getByRole } = setup();
        const input = getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } })
        expect(input).toHaveValue('test');
    })
})