import React, { type FC, type HTMLAttributes, useState, type FormEvent } from 'react'
import { Sidebar } from './Sidebar';

import { Navbar } from './Navbar';
import { type Profile, type ProfileInsertDTO } from '../../../lib/types';
import clsx from 'clsx';
import { Dialog } from '@components/dialog';
import { type User, type Session } from '@supabase/supabase-js';
import { type DialogProps } from '@components/dialog/Dialog';
import { Typography } from '@components/typography';
import { useMutation } from '@tanstack/react-query';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { Button, Input } from 'ui'

export interface LayoutProps extends HTMLAttributes<HTMLElement> {
    session: Session;
    profile: Profile;
    containerClasses?: string
}

export const Layout: FC<LayoutProps> = ({ children, className, session, profile, containerClasses, ...rest }) => {
    const [showOnboarding, setShowOnboarding] = useState(false)
    const firstLogin = !profile && session;

    return (
        <div className={clsx('flex h-full max-w-screen-2xl m-auto', className)} {...rest}>
            <Sidebar className="basis-64" />
            <main className="flex-1 p-6 flex flex-col">
                <Navbar profile={profile} session={session} />
                {/* TODO: make this element fill the vertical space */}
                {/*TODO: fix issue that makes layout overflow out of main on mac */}
                <div className={clsx('flex-1', containerClasses)}>
                    {children}
                </div>
            </main>
            {firstLogin && (
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
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setFullname(ev.target.value)}
                    label="Fullname (Firstname first)"
                    fullWidth
                />
                <Button type="submit" loading={updateProfile.isLoading}>Get Started</Button>
            </form>
        </Dialog>
    )
}

