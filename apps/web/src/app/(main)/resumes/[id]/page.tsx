import { ResumeFormContainer } from '@/components/job-details/resume-form-container';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { FullPageSpinner } from 'ui';

export default async function ResumeDetails({ params }: { params: { id: string } }) {
    const client = createClient()
    const { data: {user} } = await client.auth.getUser();
    if(!user) redirect('/auth');

    return (
        <Suspense fallback={<FullPageSpinner/>}>
            <main className="overflow-auto">
                <ResumeFormContainer user={user} resumeId={params.id} />
            </main>
        </Suspense>
    )
}
 