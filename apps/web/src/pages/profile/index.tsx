import { Layout } from '@components/layout';
import { createClient } from '@lib/supabase/server-prop';
import { type GetServerSideProps } from 'next';
import Link from 'next/link';
import { type PageProps } from '..';

export default function Profile({ user, profile }: PageProps) {
    return (
        <Layout
            pageTitle="Profile"
            profile={profile}
            containerClasses="p-6"
        >
            <div>
                <Link href="/profile/setup">Setup</Link>
            </div>
        </Layout>
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

    return {
        props: {
            user,
            profile
        }
    }
}