import { Layout } from '@components/layout';
import { ResumePreviewCard } from '@components/resume-card';
import { type Database } from 'shared';
import { type Profile, type Resume } from '@lib/types';
import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from 'ui';
import { v4 as uuid } from 'uuid';

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
            pageTitle="Resumes"
        >
            <section>
                <header className="flex justify-end items-center mb-4">
                    <Button onClick={handleCreateNew}>
                        Create New
                    </Button>
                </header>

                <section className="flex flex-wrap gap-4">
                    {resumes?.map((resume) => (
                        <ResumePreviewCard
                            key={resume.id}
                            resume={resume}
                        />
                    ))}
                </section>
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
    const { data: resumes } = await supabase.from('resumes').select();

    return {
        props: {
            session,
            profile,
            resumes
        }
    }
}