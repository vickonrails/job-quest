import { useSession, useUser } from '@hooks';
import React, { useEffect, useState } from 'react'
import { Layout } from '@components/layout';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { type Job } from 'lib/types';
import { FullPageSpinner } from '@components/spinner';
import { ChevronLeft } from 'react-feather'
import Image from 'next/image';
import { Button, Typography } from 'ui';
import { Rating } from '@components/rating/Rating';

import { Chip } from '@components/chips';
import { djb2Hash, formatDate } from '@components/utils';
import { Status_Lookup } from '@components/table/job/JobsTableConfig';
import { type ChipVariants } from '@components/chips/Chip';
import { useWindowHeight } from 'src/hooks/useWindowHeight';
import { AlertDialog } from '@components/alert-dialog';

const JobDetailsPage = () => {
    const windowHeight = useWindowHeight()
    const router = useRouter();
    const jobId = router.query.job as string;
    const client = useSupabaseClient<Database>();

    const [session, sessionLoading] = useSession();
    const [jobDetails, setJobDetails] = useState<Job>()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!jobId) return;
        setLoading(true)
        const fetchJob = async (id: string) => {
            return await client.from('jobs').select().eq('id', id);
        }

        fetchJob(jobId).then(res => {
            setLoading(false)
            const data = res.data
            // @ts-ignore
            setJobDetails(data[0]);
        }).catch(err => {
            setLoading(false)
            // 
        });
    }, [jobId, client])

    return (
        <Layout session={session ?? undefined}>
            <div>
                <button className="flex text-light-text mb-4 items-center" onClick={() => router.back()}>
                    <ChevronLeft size={20} />
                    Back
                </button>
                {loading ?
                    <FullPageSpinner /> :
                    // @ts-ignore
                    <JobDetails job={jobDetails} />
                }
            </div>
        </Layout>
    )
}


const JobDetails = ({ job }: { job: Job }) => {
    const router = useRouter()
    const [showEditDialog, setShowEditDialog] = useState(false)
    const [selectedEntity, setSelectedEntity] = useState<Job | null>()

    const handleEditClick = () => {
        // setShowEditDialog(true)
        // setSelectedEntity(job)

        return router.push(`${job.id}/edit`)
    }

    const handleEditCancel = () => {
        setShowEditDialog(false)
        setSelectedEntity(null)
    }

    return (
        <>
            <div className="flex bg-white">
                <div className="flex-2 grow-0 border-r p-6 basis-2/3">
                    <header className="mb-6">
                        <div className="flex items-center mb-2">
                            {job?.company_site && (
                                <div className="mr-5">
                                    <Image
                                        src={`https://logo.clearbit.com/${job.company_site}`}
                                        alt={job.company_name}
                                        width={80}
                                        height={80}
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-center">
                                    <Typography variant="display-xs-md" className="mb-1 mr-3 text-base-col">{job.company_name}</Typography>
                                    <Button size="xs" onClick={handleEditClick} fillType="outlined" className="inline-block py-1">Edit</Button>
                                </div>
                                <ul className="flex gap-6 text-light-text">
                                    <li><Typography variant="body-md">{job.company_name}</Typography></li>
                                    <li >{job.location}</li>
                                    <li>{Status_Lookup[job.status]}</li>
                                </ul>
                            </div>
                            <Rating size="md" value={job.priority ?? 1} />
                        </div>
                        <div className="flex flex-col gap-1">
                            <Typography variant="body-sm"><a target="_blank" rel="noreferrer noopener" className="underline" href={job.link ?? ''}>{job.link}</a></Typography>
                            {job.created_at && <Typography variant="body-sm">Saved on {formatDate(job.created_at)}</Typography>}
                            <Typography variant="body-md">{job.position}</Typography>
                        </div>
                    </header>

                    <main className="mb-6">
                        <Typography variant="display-xs" className="mb-2">Description</Typography>
                        <Typography variant="body-md" className="text-base-col">{job.description}</Typography>
                    </main>

                    <footer>
                        <JobLabels labels={job.labels ?? []} />
                    </footer>
                </div>
                <div className="flex-1 shrink-0 grow-0 basis-1/3 p-6">
                    Other tabs
                </div>
            </div>
            {showEditDialog && (
                <AlertDialog
                    open={showEditDialog}
                    title="Edit Job"
                    description={JSON.stringify(selectedEntity)}
                    onCancel={handleEditCancel}
                />
            )}
        </>
    )
}

const JobLabels = ({ labels }: { labels: string[] }) => {
    const variants = ['blue', 'purple', 'green', 'gold', 'orange']

    const getChipColors = (text: string) => {
        const index = djb2Hash(text, variants.length)
        return variants[index]
    }

    return (
        <div className="flex">
            {labels.map((label, index) => (
                <Chip key={index} label={label} variant={getChipColors(label) as ChipVariants} />
            ))}
        </div>
    )
}

export default JobDetailsPage