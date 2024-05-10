import { Layout } from '@/components/layout';
import { ResumePreviewCard } from '@/components/resume-card';
import { createClient } from '@lib/supabase/server-prop';
import { type Profile, type Resume } from '@lib/types';
import { type GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Button } from 'ui';
import { v4 as uuid } from 'uuid';

export default function ResumeBuilder({ profile, resumes }: { profile: Profile, resumes: Resume[] }) {
    const router = useRouter()

    const handleCreateNew = () => {
        const newId = uuid();
        return router.push(`/resumes/${newId}`);
    }

    return (
        <Layout
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
    const supabase = createClient(context);
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        await supabase.auth.signOut();
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single()
    const { data: resumes } = await supabase.from('resumes').select().eq('user_id', user.id);

    return {
        props: {
            profile,
            resumes
        }
    }
}