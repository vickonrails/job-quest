import { Layout } from '@components/layout';
import { SetupNavigator } from '@components/resume-builder/setup/components/set-up-navigator';
import { Steps } from '@components/resume-builder/setup/components/steps-renderer';
import { createClient } from '@lib/supabase/server-prop';
import { type Profile } from '@lib/types';
import { type SupabaseClient, type User } from '@supabase/auth-helpers-nextjs';
import { Briefcase, Construction, Contact2, GraduationCap, Library, Zap } from 'lucide-react';
import { type GetServerSideProps } from 'next';
import { useMemo, useState } from 'react';
import { type Database } from 'shared';
import { useProfile } from 'src/hooks/useProfile';
import { SetupProvider } from 'src/hooks/useSetupContext';
import { type PageProps } from '..';

export async function fetchWorkExperience({ userId, client }: { userId?: string, client: SupabaseClient<Database> }) {
    if (!userId) return;
    // TODO: error handling
    const experiences = await client.from('work_experience').select('*, highlights ( * )').filter('resume_id', 'is', null).eq('user_id', userId)
    return experiences.data
}

// TODO: fetch the initial values from the database and instantiate the form with it 
// TODO: the steps should be available to navigate to from the UI
export default function Setup({ profile: initialProfile, user }: PageProps) {
    const { data: profile } = useProfile(user.id, initialProfile)
    return (
        <Layout
            pageTitle="Setup Profile"
            containerClasses="flex bg-gray-50 overflow-auto"
            profile={profile}
        >
            <SetupSection profile={profile} user={user} />
        </Layout >
    )
}

export function SetupSection({ profile, user }: { profile: Profile, user: User }) {
    const [step, setStep] = useState(1);
    const canMoveNext = step < 6
    const canMovePrev = useMemo(() => step > 1, [step])
    const next = () => {
        if (!canMoveNext) return
        setStep(step + 1)
    }

    const prev = () => {
        if (step <= 1) return
        setStep(step - 1)
    }

    return (
        <SetupProvider value={{ step, next, prev, canMoveNext, canMovePrev, user }}>
            <aside className="w-1/5 border-r sticky top-0 px-3 py-6">
                <ul className="text-sm flex flex-col">
                    <SetupNavigator step={1} onClick={() => setStep(1)}>
                        <Library size={20} />
                        <span>Basic Information</span>
                    </SetupNavigator>
                    <SetupNavigator step={2} onClick={() => setStep(2)}>
                        <Briefcase size={20} />
                        <span>Work Experience</span>
                    </SetupNavigator>
                    <SetupNavigator step={3} onClick={() => setStep(3)}>
                        <GraduationCap size={20} />
                        <span>Education</span>
                    </SetupNavigator>
                    <SetupNavigator step={4} onClick={() => setStep(4)}>
                        <Construction size={20} />
                        <span>Projects</span>
                    </SetupNavigator>
                    <SetupNavigator step={5} onClick={() => setStep(5)}>
                        <Zap size={20} />
                        <span>Skills</span>
                    </SetupNavigator>
                    <SetupNavigator step={6} onClick={() => setStep(6)}>
                        <Contact2 />
                        <span>Contact Information</span>
                    </SetupNavigator>
                </ul>
            </aside>
            <main className="flex-1 py-6">
                <Steps profile={profile} />
            </main>
        </SetupProvider>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context);
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        await supabase.auth.signOut();
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single()
    const { data: workExperience } = await supabase.from('work_experience').select();

    return {
        props: {
            user,
            profile,
            workExperience
        }
    }
}
