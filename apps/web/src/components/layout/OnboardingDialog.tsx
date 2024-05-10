import { Dialog } from '@/components/dialog';
import { type DialogProps } from '@/components/dialog/Dialog';
import { Typography } from '@/components/typography';

import { createClient } from '@lib/supabase/component';
import { type User } from '@supabase/supabase-js';
import { useMutation } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { Button, Input } from 'ui';
import { type Profile, type ProfileInsertDTO } from '../../../lib/types';

interface OnboardingDialogProps extends Omit<DialogProps, 'title' | 'children'> {
    user?: User;
    setProfile: (profile: Profile) => void;
}

function OnboardingDialog({ open, user, setProfile, onOpenChange }: OnboardingDialogProps) {
    const [fullname, setFullname] = useState('');
    const client = createClient();

    const updateProfile = useMutation({
        mutationFn: async (data: ProfileInsertDTO) => {
            try {
                const { id, full_name } = data
                const { data: profile } = await client.from('profiles').insert({ id, full_name, email_address: user?.email }).select();
                if (profile?.length) {
                    profile[0] && setProfile(profile[0])
                }
            } catch (err) {
                throw err;
            }
        }
    })

    const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        if (!user) { throw new Error('') }
        ev.preventDefault();
        await updateProfile.mutateAsync({ full_name: fullname, id: user?.id })
        onOpenChange?.(false);
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

export default OnboardingDialog