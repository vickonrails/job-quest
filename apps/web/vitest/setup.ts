import matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';

const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)

vi.mock('@supabase/ssr', () => ({
    createBrowserClient: vi.fn(() => ({
        auth: {},
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                filter: vi.fn(() => ({
                    eq: vi.fn(() => ({
                        data: []
                    }))
                }))
            }))
        }))
    }))
}))

expect.extend(matchers);