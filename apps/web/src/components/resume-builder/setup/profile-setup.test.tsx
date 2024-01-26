import { type Profile } from '@lib/types';
import { type Session } from '@supabase/auth-helpers-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cleanup, render, waitFor } from '@testing-library/react';
import { SetupProvider, type SetupContext } from 'src/hooks/useSetupContext';
import { SetupSection } from 'src/pages/profile/setup';
import { describe } from 'vitest';
import { Steps } from './renderer';

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
})

const session = {
    user: {
        email: 'johnDoe@gmail.com',
        id: '9bd9387d-f0b1-4550-9222-253686641ae3'
    }
} as Session

const profile = {
    username: 'John Doe',
    id: '9bd9387d-f0b1-4550-9222-253686641ae3',
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    skills: [{ label: 'React' }, { label: 'Typescript' }, { label: 'Javascript' }]
} as unknown as Profile


describe('Profile Setup', () => {
    const testClient = createTestQueryClient();
    const setup = () => {
        return render(
            <QueryClientProvider client={testClient}>
                <SetupSection
                    session={session}
                    profile={profile}
                />
            </QueryClientProvider>
        )
    }

    afterEach(() => {
        testClient.clear();
        cleanup()
    })

    it('renders setup navigation with correct links', () => {
        const { getAllByTestId } = setup();
        const links = getAllByTestId('setup-navigator');
        expect(links).toHaveLength(6);
    })

    it('renders the correct form section based on the step', () => {
        const { } = setup();
    })

    it('next & prev functions navigate the steps', () => {
        // 
    })
});

// ---- <Steps /> Component ---- //
describe('Steps', () => {
    const testClient = createTestQueryClient();
    const setup = ({ step }: { step: number }) => {
        const setupCtxVal = { step, session } as SetupContext
        return render(
            <QueryClientProvider client={testClient}>
                <SetupProvider value={setupCtxVal}>
                    <Steps profile={profile} />
                </SetupProvider>
            </QueryClientProvider>
        )
    }

    afterEach(() => {
        testClient.clear();
        cleanup()
    });

    describe('Basic Information', () => {
        it('renders the correct form section based on the step', () => {
            const { getByTestId, getAllByRole } = setup({ step: 1 });
            expect(getByTestId('basic-information')).toBeInTheDocument();
            expect(getAllByRole('textbox')).toHaveLength(4);

            expect(getByTestId('fullname')).toBeInTheDocument();
            expect(getByTestId('title')).toBeInTheDocument();
            expect(getByTestId('summary')).toBeInTheDocument();
            expect(getByTestId('location')).toBeInTheDocument();
        })
    })

    describe('Work Experience', () => {
        it('renders the correct form section based on the step', async () => {
            const { getByTestId, queryByTestId } = setup({ step: 2 });
            expect(getByTestId('work-experience-spinner')).toBeInTheDocument();
            await waitFor(() => {
                expect(queryByTestId('work-experience-spinner')).not.toBeInTheDocument();
            });
            expect(getByTestId('work-experience')).toBeInTheDocument();
        })
    })

    describe('Education', () => {
        it('renders the correct form section based on the step', async () => {
            const { getByTestId, queryByTestId } = setup({ step: 3 });
            expect(getByTestId('education-spinner')).toBeInTheDocument();
            await waitFor(() => {
                expect(queryByTestId('education-spinner')).not.toBeInTheDocument();
            });
            expect(getByTestId('education')).toBeInTheDocument();
        })
    })

    describe('Projects', () => {
        it('renders the correct form section based on the step', async () => {
            const { getByTestId, queryByTestId } = setup({ step: 4 });
            expect(getByTestId('projects-spinner')).toBeInTheDocument();
            await waitFor(() => {
                expect(queryByTestId('projects')).not.toBeInTheDocument();
            });
        })
    })

    describe('Skills', () => {
        it('renders the correct form section based on the step', () => {
            const { getByTestId, getAllByRole, getAllByTestId } = setup({ step: 5 });
            expect(getByTestId('skills')).toBeInTheDocument();
            expect(getAllByRole('textbox')).toHaveLength(1);
            expect(getAllByTestId('chip')).toHaveLength(3)
        })
    })

    describe('Contact Information', () => {
        it('renders the correct form section based on the step', () => {
            const { getByTestId, getAllByRole } = setup({ step: 6 });
            expect(getByTestId('contact-information')).toBeInTheDocument();
            expect(getAllByRole('textbox')).toHaveLength(4);

            expect(getByTestId('email-address')).toBeInTheDocument();
            expect(getByTestId('linkedin-url')).toBeInTheDocument();
            expect(getByTestId('github-url')).toBeInTheDocument();
            expect(getByTestId('personal-website')).toBeInTheDocument();
        })
    })
})

