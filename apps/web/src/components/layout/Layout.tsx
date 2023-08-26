import React, { useEffect, type FC, type HTMLAttributes, useState, type FormEvent } from 'react'
import { Sidebar } from './Sidebar';

import { Navbar } from './Navbar';
import { type ProfileInsertDTO } from '../../../lib/types';
import clsx from 'clsx';
import { Dialog } from '@components/dialog';
import { type User, type Session } from '@supabase/supabase-js';
import { useProfile } from 'src/hooks/useProfile';
import { type DialogProps } from '@components/dialog/Dialog';
import { Input } from '@components/input';
import { Typography } from '@components/typography';
import { Button } from '@components/button';
import { useMutation } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
    session?: Session;
    containerClasses?: string
}

export const Layout: FC<LayoutProps> = ({ children, className, session, containerClasses, ...rest }) => {
    const [showOnboarding, setShowOnboarding] = useState(false)
    const { isLoading, data: profile } = useProfile(session?.user)

    useEffect(() => {
        const isFirstLogin = !isLoading && !profile;
        setShowOnboarding(isFirstLogin);
    }, [profile, isLoading])

    return (
        <div className={clsx('flex h-full', className)} {...rest}>
            <Sidebar className="basis-64" />
            <main className="bg-indigo-50 flex-1 p-6 flex flex-col overflow-auto">
                <Navbar profile={profile} />
                {/* TODO: make this element fill the vertical space */}
                {/*TODO: fix issue that makes layout overflow out of main on mac */}
                <div className={clsx('flex-1', containerClasses)}>
                    {children}
                </div>
            </main>
            {(showOnboarding && session) && (
                <OnboardingDialog
                    open={showOnboarding}
                    user={session?.user}
                    onOpenChange={setShowOnboarding}
                />
            )}
        </div>
    )
}

interface OnboardingDialogProps extends Omit<DialogProps, 'title' | 'children'> {
    user?: User;
}

function OnboardingDialog({ open, user, onOpenChange }: OnboardingDialogProps) {
    const [fullname, setFullname] = useState('');
    const client = useSupabaseClient<Database>();

    const updateProfile = useMutation({
        mutationFn: async (data: ProfileInsertDTO) => {
            try {
                const { id, full_name } = data
                await client.from('profiles').insert({ id, full_name })
                onOpenChange?.(false);
            } catch (err) {
                throw err;
            }
        }
    })

    const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        if (!user) { throw new Error('') }
        ev.preventDefault();
        await updateProfile.mutateAsync({ full_name: fullname, id: user?.id })
    }

    return (
        <Dialog title="Sorry to interrupt 🙏" open={open}>
            <form onSubmit={handleSubmit}>
                <Typography variant="body-sm" className="mb-4">Please provide additional information for a more personalized experience</Typography>
                <Input
                    placeholder="What's your name?"
                    value={fullname}
                    onChange={ev => setFullname(ev.target.value)}
                    label="Fullname (Firstname first)"
                    fullWidth
                />
                <Button type="submit" loading={updateProfile.isLoading}>Get Started</Button>
            </form>
        </Dialog>
    )
}

