import { Layout } from '@components/layout';
import { type Database } from '@lib/database.types';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { type PageProps } from '.';

export default function Profile({ session, profile }: PageProps) {
    return (
        <Layout
            session={session}
            profile={profile}
        >
            <h1 className="text-xl font-medium">Profile</h1>
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