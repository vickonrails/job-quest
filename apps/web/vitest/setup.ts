import matchers from '@testing-library/jest-dom/matchers';
import { expect, vi } from 'vitest';
import { MockPointerEvent } from './mock-pointer-event'
import { QueryClient } from '@tanstack/react-query';

beforeEach(() => {
    vi.restoreAllMocks();
})

/** mock the Resize Observer */
const ResizeObserverMock = vi.fn(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn()
}))

beforeAll(() => {
    vi.stubGlobal('ResizeObserver', ResizeObserverMock)

    vi.mock('@supabase/ssr', () => ({
        createBrowserClient: vi.fn(() => ({
            auth: {},
            from: vi.fn(() => ({
                select: vi.fn(),
                upsert: vi.fn().mockResolvedValue({})
            }))
        }))
    }))

    vi.mock('next/router', () => ({
        useRouter() {
            return {
                pathname: ''
            };
        },
    }));
})

/** mock PointerEvents for advanced user mouse events like radix-select, etc 
 * gotten from https://github.com/radix-ui/primitives/issues/1822#issuecomment-1474172897
 * 
*/
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();

/**
 * Test QueryClient Utility
 */
export const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
})



expect.extend(matchers);