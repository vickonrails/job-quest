import { Layout } from '@components/layout';
import { type Database } from '@lib/database.types';
import { type Resume, type Profile } from '@lib/types';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'ui';
import { v4 as uuid } from 'uuid'

export default function ResumeBuilder({ session, profile, resumes }: { session: Session, profile: Profile, resumes: Resume[] }) {
    const router = useRouter()

    const handleCreateNew = () => {
        const newId = uuid();
        return router.push(`/resumes/${newId}`);
    }

    return (
        <Layout
            session={session}
            profile={profile}
            containerClasses="p-6"
        >
            <section>
                <header className="flex justify-between items-center mb-4">
                    <h1 className="text-xl font-medium">Resumes</h1>
                    <Button size="sm" onClick={handleCreateNew}>
                        Create New
                    </Button>
                </header>

                <main>
                    {resumes.map((resume) => (
                        <Link className="underline text-primary block" key={resume.id} href={`/resumes/${resume.id}`}>{resume.title} - {resume.created_at?.split('T')[0]}</Link>
                    ))}
                </main>
            </section>
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
    const { data: resumes } = await supabase.from('resumes').select().eq('user_id', session.user.id);

    return {
        props: {
            session,
            profile,
            resumes
        }
    }
}