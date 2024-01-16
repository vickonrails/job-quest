import { Layout } from '@components/layout';
import { type Database } from '@lib/database.types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { createContext, useContext, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from 'ui';
import { type PageProps } from '..';
import { Steps } from '@components/resume-builder/setup/renderer';

// TODO: support to toggle close and open the jobs
interface WorkExperience {
    title?: string
    company?: string
    location?: string
    startDate?: string
    endDate?: string
    summary?: string
    highlights?: { text?: string }[]
}

export interface FormFields {
    fullname?: string
    title?: string
    summary?: string
    email?: string
    location?: string
    phoneNumber?: string
    website?: string
    // skills?: Skills
    workExperience?: WorkExperience[]
    // otherProjects?: OtherProjects[]
    // education?: Education[]
}

// TODO: use context
const setupContextDefault = {
    step: 2,
    next: () => {/** */ },
    prev: () => { /** */ },
    canMoveNext: false,
    canMovePrev: false
}

const SetupContext = createContext(setupContextDefault)
const SetupProvider = SetupContext.Provider

export function useSetupContext() {
    return useContext(SetupContext);
}

export default function Setup({ profile, session }: PageProps) {
    const [step, setStep] = useState(1)
    const form = useForm<FormFields>({ defaultValues: { workExperience: [{ highlights: [{ text: '' }] }] } });

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
            containerClasses="mt-6"
            session={session}
            profile={profile}
        >
            <SetupProvider value={{ step, next, prev, canMoveNext, canMovePrev }}>
                <FormProvider {...form}>
                    <section className="border p-6 px-8 rounded-sm w-2/3 mx-auto">
                        <Steps />
                        <Button onClick={next}>{canMoveNext ? 'Continue' : 'Complete'}</Button>
                    </section>
                </FormProvider>
            </SetupProvider>
        </Layout>
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

    return {
        props: {
            session,
            profile
        }
    }
}
