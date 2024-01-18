import { Layout } from '@components/layout';
import { Steps } from '@components/resume-builder/setup/renderer';
import { SetupNavigator } from '@components/resume-builder/setup/set-up-navigator';
import { type Database } from '@lib/database.types';
import { createPagesServerClient, type SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQueryClient } from '@tanstack/react-query';
import { type GetServerSideProps } from 'next';
import { useMemo, useState } from 'react';
import { SetupProvider } from 'src/hooks/useSetupContext';
import { type PageProps } from '..';

export async function fetchWorkExperience({ userId, client }: { userId?: string, client: SupabaseClient<Database> }) {
    if (!userId) return;
    // TODO: error handling
    return (await client.from('work_experience').select('*').eq('user_id', userId)).data;
}

// TODO: fetch the initial values from the database and instantiate the form with it 
// TODO: the steps should be available to navigate to from the UI
export default function Setup({ profile, session }: PageProps) {
    const [step, setStep] = useState(1);
    const client = useSupabaseClient<Database>()
    const queryClient = useQueryClient()

    const canMoveNext = step < 4
    const canMovePrev = useMemo(() => step > 1, [step])
    const next = async () => {
        if (!canMoveNext) return

        switch (step) {
            case 1:
            default:
                await queryClient.prefetchQuery(['work_experience'], { queryFn: () => fetchWorkExperience({ client, userId: session.user.id }) })
        }

        setStep(step + 1)
    }

    const prev = () => {
        if (step <= 1) return
        setStep(step - 1)
    }

    return (
        <Layout
            pageTitle="Setup Profile"
            containerClasses="flex px-4 py-8 bg-gray-50 overflow-auto"
            session={session}
            profile={profile}
        >
            <SetupProvider value={{ step, next, prev, canMoveNext, canMovePrev, session, }}>
                <aside className="w-1/5 border-r sticky top-0">
                    <ul className="text-sm flex flex-col">
                        <SetupNavigator step={1} onClick={() => setStep(1)}>Basic Information</SetupNavigator>
                        <SetupNavigator step={2} onClick={() => setStep(2)}>Work Experience</SetupNavigator>
                        <SetupNavigator step={3} onClick={() => setStep(3)}>Education</SetupNavigator>
                        <SetupNavigator step={4} onClick={() => setStep(4)}>Other Links</SetupNavigator>
                    </ul>
                </aside>
                <main className="flex-1">
                    <Steps profile={profile} />
                </main>
            </SetupProvider>
        </Layout >
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        await supabase.auth.signOut();
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', session.user.id).single()
    const { data: workExperience } = await supabase.from('work_experience').select().eq('user_id', session.user.id);

    return {
        props: {
            session,
            profile,
            workExperience
        }
    }
}
