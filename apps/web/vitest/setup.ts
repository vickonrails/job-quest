import matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';

const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

expect.extend(matchers);