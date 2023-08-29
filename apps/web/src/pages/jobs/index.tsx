

import React from 'react'
import { Layout } from '@components/layout';
import JobsTable from '@components/table/job/JobsTable';
import { Typography } from '@components/typography';
import { type Session, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { type Database } from 'lib/database.types';
import { type Profile } from 'lib/types';

// I'm currently rendering on the client. How can we improve this

const Tracker = ({ session, profile }: { session: Session, profile: Profile }) => {
    return (
        <Layout session={session} profile={profile}>
            <div className="flex justify-between my-4">
                <Typography variant="display-xs-md" as="h1">All Jobs</Typography>
            </div>
            <div className="rounded-xl">
                <JobsTable />
            </div>
        </Layout>
    )
}

// TODO: consider what approach to use for the dashboard either server-side or client-side rendering

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();
    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()

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
            session,
            profile
        }
    }
}

export default Tracker