import BackButton from '@components/back-button'
import { Layout } from '@components/layout'
import { useToast } from '@components/toast/use-toast'
import { createClient } from '@lib/supabase/component'
import { createClient as createServerClient } from '@lib/supabase/server-prop'
import { type CoverLetter, type Job } from '@lib/types'
import { Save, Wand2 } from 'lucide-react'
import { type GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useCoverLetter } from 'src/hooks/useCoverLetter'
import { useMagicWrite } from 'src/hooks/useMagicWrite'
import { type PageProps } from '@/pages/archive-index'
import { Button, Spinner } from 'ui'

interface CoverLetterProps extends PageProps {
    job: Job
    coverLetter: CoverLetter
}

export default function CoverLetter({ user, profile, job, coverLetter }: CoverLetterProps) {
    const router = useRouter()
    const client = createClient()
    const { value, saving, onChange, setValue, saveValue } = useCoverLetter({ job, coverLetter, user });
    const { writing, write } = useMagicWrite();
    const { toast } = useToast()

    const handleMagicWriteClick = async () => {
        try {
            const { data: workExperience, error: _workExperienceError } = await client.from('work_experience').select('company_name, job_title, location, highlights (text)').is('resume_id', null);
            if (_workExperienceError) throw _workExperienceError
            const { data: education, error: _educationError } = await client.from('education').select('institution, degree, field_of_study, highlights (text)').is('resume_id', null);
            if (_educationError) throw _educationError

            const { coverLetter } = await write({
                education,
                workExperience,
                jobDescription: job.description ?? '',
                jobTitle: job.position,
                professionalExperience: profile.professional_summary ?? '',
                skills: profile.skills?.map(skill => skill.label ?? '')
            });
            setValue(coverLetter);
            await saveValue(coverLetter);
        } catch (error) {
            toast({
                description: 'Failed to generate cover letter',
                title: 'Error',
                variant: 'destructive'
            })
        }
    }

    return (
        <Layout
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
                        onChange={onChange}
                        placeholder="Write your cover letter here"
                        rows={20}
                        value={value}
                        disabled={writing}
                        className="w-full p-4 pb-0 flex-1 text-accent-foreground mb-2 border"
                        autoFocus
                    />
                    <div className="flex gap-2 w-full justify-end items-center">
                        {saving && (
                            <div className="flex-1">
                                <Spinner className="h-6 w-6" />
                            </div>
                        )}

                        <Button type="button" variant="outline" className="flex gap-1" onClick={handleMagicWriteClick} loading={writing}>
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
    const supabase = createServerClient(context);
    const { data: { user } } = await supabase.auth.getUser();
    const jobId = context.params?.['job'] as string;

    if (!user) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single()
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
        const { data } = await supabase.from('cover_letters').insert({ user_id: user.id, text: '' }).select().single()
        job.cover_letter_id = data?.id ?? '';
        await supabase.from('jobs').upsert({ ...job });

        return {
            props: {
                profile,
                job,
                coverLetter: data
            }
        }
    }

    const { data: coverLetter } = await supabase.from('cover_letters').select().eq('id', job?.cover_letter_id).single()

    return {
        props: {
            profile,
            job,
            coverLetter
        }
    }

}