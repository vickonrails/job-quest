import BackButton from '@components/back-button'
import { Layout } from '@components/layout'
import { useToast } from '@components/toast/use-toast'
import { type Database } from '@lib/database.types'
import { type CoverLetter, type Job } from '@lib/types'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { debounce } from '@utils/debounce'
import { Save, Wand2 } from 'lucide-react'
import { type GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { Button, Spinner } from 'ui'
import { type PageProps } from '..'

interface CoverLetterProps extends PageProps {
    job: Job
    coverLetter: CoverLetter
}

export default function CoverLetter({ session, profile, job, coverLetter }: CoverLetterProps) {
    const router = useRouter()
    const [value, setValue] = useState(coverLetter.text ?? '')
    const client = useSupabaseClient<Database>();
    const [loading, setLoading] = useState(false)
    const { toast } = useToast();

    const debouncedSendInputToServer = useCallback(
        debounce(async (text: string) => {
            if (!job.cover_letter_id) return
            const { error } = await client.from('cover_letters').upsert({
                id: job.cover_letter_id,
                text
            });

            if (error) throw error;
        }, 1500),
        [setLoading, job.cover_letter_id, toast, client]
    );

    const handleInputChange = async (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(event.target.value);
        try {
            setLoading(true);
            await debouncedSendInputToServer(event.target.value);
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to save cover letter',
                variant: 'destructive'
            })
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout
            session={session}
            profile={profile}
            containerClasses="p-6 overflow-hidden"
            pageTitle="Create Cover Letter"
        >
            <div className="flex justify-start">
                <BackButton onClick={() => router.back()}>Back to job</BackButton>
            </div>

            <div className="flex h-full gap-1">
                <form className="flex flex-col items-start h-full p-1 flex-1 w-3/5 pb-6">
                    <textarea
                        onChange={handleInputChange}
                        placeholder="Write your cover letter here"
                        rows={20}
                        value={value}
                        className="w-full p-4 pb-0 flex-1 text-accent-foreground mb-2 border"
                        autoFocus
                    />
                    <div className="flex gap-2 w-full justify-end items-center">
                        {loading && (
                            <div className="flex-1">
                                <Spinner className="h-6 w-6" />
                            </div>
                        )}

                        <Button type="button" variant="outline" className="flex gap-1">
                            <Wand2 size={18} />
                            <span>Magic Write</span>
                        </Button>
                        <Button type="button" className="flex gap-1">
                            <Save size={18} />
                            <span>Copy</span>
                        </Button>
                    </div>
                </form>
                <div className="p-4 w-2/5 border overflow-auto mt-1">
                    <p>{job.position}</p>
                    <div className="text-neutral-600 text-sm" dangerouslySetInnerHTML={{ __html: job.description ?? '' }} />
                </div>
            </div>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createPagesServerClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();
    const jobId = context.query?.['job-id'] as string;

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()
    const { data: job } = await supabase.from('jobs').select().eq('id', jobId).single();

    if (!job) {
        return {
            redirect: {
                destination: '/jobs',
                permanent: false
            }
        }
    }

    if (!job.cover_letter_id) {
        const { data } = await supabase.from('cover_letters').insert({ text: '' }).select().single()
        job.cover_letter_id = data?.id ?? '';
        await supabase.from('jobs').upsert({ ...job });

        return {
            props: {
                session,
                profile,
                job,
                coverLetter: data
            }
        }
    }

    const { data: coverLetter } = await supabase.from('cover_letters').select().eq('id', job?.cover_letter_id).single()

    return {
        props: {
            session,
            profile,
            job,
            coverLetter
        }
    }

}