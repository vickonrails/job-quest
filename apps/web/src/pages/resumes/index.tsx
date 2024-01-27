import { Layout } from '@components/layout';
import { type Database } from '@lib/database.types';
import { type Profile } from '@lib/types';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import Link from 'next/link';
import { Button } from 'ui';

export default function ResumeBuilder({ session, profile }: { session: Session, profile: Profile }) {
    return (
        <Layout
            session={session}
            profile={profile}
            containerClasses="p-6"
        >
            <div>
                <h1 className="text-xl font-medium">Resumes</h1>
                <Button asChild>
                    <Link href="/resumes/builder">
                        Create New
                    </Link>
                </Button>
            </div>
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