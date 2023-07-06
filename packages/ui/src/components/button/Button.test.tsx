import { beforeEach, describe, expect, it } from "vitest";
import { Button } from './Button'
import { cleanup, render, screen } from '@testing-library/react'

describe("Button", () => {
    beforeEach(() => {
        cleanup();
    });

    it("Renders without errors ", () => {
        render(<Button />);
        const button = screen.getByRole('button');
        expect(button).toBeDefined();
    });

    it("renders spinner when loading", () => {
        render(<Button loading />);
        const button = screen.getByRole('button');
        const spinner = screen.getByTestId('spinner');
        expect(button).toBeDefined();
        expect(spinner).toBeDefined();
    })

    it("is disabled when disable prop is passed", () => {
        render(<Button disabled />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
    })
});