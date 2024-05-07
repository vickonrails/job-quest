import { TooltipProvider } from '@components/tooltip';
import { cleanup, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { type Profile } from '../lib/types';
import { Layout, type LayoutProps } from '../src/components/layout/Layout';
import { Navbar, type NavbarProps } from '../src/components/layout/Navbar';

const profile = {
    id: '',
    full_name: 'John Doe',
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    created_at: '',
    email_address: '',
    updated_at: ''
} as unknown as Profile

describe('Navbar', () => {
    afterEach(() => {
        cleanup()
    });

    const setup = (props: NavbarProps) => {
        return render(<Navbar {...props} />)
    }

    it('render correct user profile details', () => {
        const { getByText } = setup({ profile, toggleSidebar: () => { /** */ } });
        expect(getByText('John Doe')).toBeTruthy();
    });
});

describe('Layout', () => {
    afterEach(() => {
        cleanup();
    })

    const setup = (props: LayoutProps) => {
        return render(
            <TooltipProvider>
                <Layout {...props} />
            </TooltipProvider>
        )
    }

    it('renders all the correct links', () => {
        const links = ['dashboard', 'job tracker', 'my resumes', 'notes', 'reminders', 'documents', 'contacts'];
        const { getAllByRole } = setup({ profile });
        const navLinks = getAllByRole('link');
        const hasCorrectLinks = navLinks.filter((link, index) => {
            return link.textContent?.toLowerCase() === links[index];
        });
        expect(hasCorrectLinks.length).toBe(links.length);
    });

    it('renders navbar and sidebar', () => {
        const { getByTestId } = setup({ profile });
        expect(getByTestId('navbar')).toBeInTheDocument();
        expect(getByTestId('sidebar')).toBeInTheDocument();
    });

    it('renders children element correct', () => {
        const { getByText } = setup({ profile, children: <div>Hello World</div> })
        expect(getByText('Hello World')).toBeTruthy();
    });
});

