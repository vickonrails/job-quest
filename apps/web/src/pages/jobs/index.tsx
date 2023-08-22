

import React from 'react'
import { Layout } from '@components/layout';
import JobsTable from '@components/table/job/JobsTable';
import { FullPageSpinner } from '@components/spinner';
import { Typography } from '@components/typography';
import { type Session, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { type Database } from 'lib/database.types';
import { useProfile } from 'src/hooks/useProfile';

// I'm currently rendering on the client. How can we improve this

const Tracker = ({ session }: { session: Session }) => {
    const { data: profile, isLoading } = useProfile(session.user)
    return (
        <Layout>
            {isLoading ? <FullPageSpinner /> : (
                <>
                    <div className="flex justify-between mb-4">
                        <Typography variant="display-xs-md" as="h1">{profile?.full_name}{'\'s Board'}</Typography>
                    </div>
                    <div className="rounded-xl">
                        <JobsTable />
                    </div>
                </>
            )}
        </Layout>
    )
}

// TODO: consider what approach to use for the dashboard either server-side or client-side rendering

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    return {
        props: {
            session
        }
    }
}

export default Tracker