import { render, cleanup } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest';
import { Navbar, type NavbarProps } from './Navbar';
import { type Session } from '@supabase/supabase-js';
import { type Profile } from '../../../lib/types';
import { Layout, type LayoutProps } from './Layout';

const session = {
    user: {
        email: 'johnDoe@gmail.com'
    }
} as unknown as Session

const profile = {
    username: 'John Doe'
} as Profile

describe('Navbar', () => {
    afterEach(() => {
        cleanup()
    });

    const setup = (props: NavbarProps) => {
        return render(<Navbar {...props} />)
    }

    it('render correct user profile details', () => {
        const { getByText } = setup({ session, profile });
        expect(getByText('John Doe')).toBeTruthy();
        expect(getByText('johnDoe@gmail.com')).toBeTruthy();
    });

    it('renders search input', () => {
        const { getByRole } = setup({});
        expect(getByRole('textbox')).toBeInTheDocument();
    })
});

describe('Layout', () => {

    beforeAll(() => {
        vi.mock('next/router', () => ({
            useRouter() {
                return {
                    pathname: ''
                };
            },
        }));
    })

    afterAll(() => vi.resetAllMocks());

    afterEach(() => {
        cleanup();
    })

    const setup = (props: LayoutProps) => {
        return render(<Layout {...props} />)
    }

    it('renders all the correct links', () => {
        const links = ['dashboard', 'application tracker', 'resume builder', 'notes', 'reminder', 'documents', 'contacts'];
        const { getAllByRole } = setup({ session, profile });
        const navLinks = getAllByRole('link');
        const hasCorrectLinks = navLinks.filter((link, index) => {
            return link.textContent?.toLowerCase() === links[index];
        });
        expect(hasCorrectLinks.length).toBe(links.length);
    });

    it('renders navbar and sidebar', () => {
        const { getByTestId } = setup({ session, profile });
        expect(getByTestId('navbar')).toBeInTheDocument();
        expect(getByTestId('sidebar')).toBeInTheDocument();
    });

    it('renders children element correct', () => {
        const { getByText } = setup({ children: 'Hello World' });
        expect(getByText('Hello World')).toBeTruthy();
    });
});

