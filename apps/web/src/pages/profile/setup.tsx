import { Layout } from '@components/layout';
import { Steps } from '@components/resume-builder/setup/renderer';
import { type Database } from '@lib/database.types';
import { type WorkExperience } from '@lib/types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { cn } from '@utils/cn';
import { type GetServerSideProps } from 'next';
import { useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { SetupProvider, useSetupContext } from 'src/hooks/useSetupContext';
import { type PageProps } from '..';

// TODO: support to toggle close and open the jobs

export interface FormFields {
    full_name?: string
    title?: string
    professional_summary?: string
    email?: string
    location?: string
    phoneNumber?: string
    website?: string
    // skills?: Skills
    // change to work_experience
    workExperience?: WorkExperience[]
    // otherProjects?: OtherProjects[]
    // education?: Education[]
}

interface SetupPageProps extends PageProps {
    workExperience: WorkExperience[]
}

const defaultWorkExperience = {
    company_name: '',
    job_title: '',
    location: '',
    start_date: '',
    end_date: '',
    highlights: [],
    user_id: ''
}

// TODO: fetch the initial values from the database and instantiate the form with it 
// TODO: the steps should be available to navigate to from the UI
export default function Setup({ profile, session, workExperience }: SetupPageProps) {
    const [step, setStep] = useState(2)
    // TODO: find a way to serialize this initial info into the form
    const form = useForm<FormFields>({ defaultValues: { full_name: profile.full_name ?? '', location: profile.location ?? '', title: profile.title ?? '', professional_summary: profile.professional_summary ?? '', workExperience: workExperience.length ? workExperience : [defaultWorkExperience] } });

    const canMoveNext = step < 4
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
        <Layout
            pageTitle="Setup Profile"
            containerClasses="flex px-4 py-8 bg-gray-50 overflow-auto"
            session={session}
            profile={profile}
        >
            <SetupProvider value={{ step, next, prev, canMoveNext, canMovePrev, session }}>
                <aside className="w-1/5 border-r sticky top-0">
                    <ul className="text-sm flex flex-col">
                        <SetupNavigator step={1} onClick={() => setStep(1)}>Basic Information</SetupNavigator>
                        <SetupNavigator step={2} onClick={() => setStep(2)}>Work Experience</SetupNavigator>
                        <SetupNavigator step={3} onClick={() => setStep(3)}>Education</SetupNavigator>
                        <SetupNavigator step={4} onClick={() => setStep(4)}>Other Links</SetupNavigator>
                    </ul>
                </aside>
                <main className="flex-1">
                    <FormProvider {...form}>
                        {/* <section> */}
                        <Steps />
                        {/* TODO: on every click, we're submitting the form and doing an optimistic update */}
                        {/* <Button onClick={next}>{canMoveNext ? 'Continue' : 'Complete'}</Button> */}
                        {/* </section> */}
                    </FormProvider>
                </main>
            </SetupProvider>
        </Layout >
    )
}

function SetupNavigator(props: React.AllHTMLAttributes<HTMLAnchorElement> & { step: number }) {
    const { step: currentStep } = useSetupContext()
    const isActive = currentStep === props.step

    return (
        <li className={cn('px-2 py-3 text-muted-foreground', isActive && 'bg-gray-100 border-l-4 border-primary pl-3 text-primary')}>
            <a href="#" className="block" {...props} />
        </li>
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
