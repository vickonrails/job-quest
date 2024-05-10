'use client'

import { SetupProvider } from '@/hooks/useSetupContext';
import { type User } from '@supabase/supabase-js';
import { type Profile } from 'lib/types';
import { useMemo, useState } from 'react';
import SetupNav from './setup-navigator';
import { Steps } from './steps-renderer';

export default function ProfileSetup({ profile, user }: { profile: Profile, user: User }) {
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
        <SetupProvider value={{ step, next, setStep, prev, canMoveNext, canMovePrev, user }}>
            <SetupNav />
            <main className="p-6 flex-1">
                <Steps profile={profile} />
            </main>
        </SetupProvider>
    )
}
