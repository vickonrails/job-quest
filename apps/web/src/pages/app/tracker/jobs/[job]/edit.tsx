import { Layout } from '@components/layout';
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { JobForm } from '../new';
import { type Database } from 'lib/database.types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type JobUpdateDTO } from 'lib/types';
import { FullPageSpinner } from '@components/spinner';
import { ChevronLeft } from 'react-feather';

const useJobEdit = (job: JobUpdateDTO) => {
    const [position, setPosition] = useState(job?.position ?? '')
    const [description, setDescription] = useState(job?.description ?? '')
    const [companyName, setCompanyName] = useState(job?.company_name ?? '')
    const [companySite, setCompanySite] = useState(job?.company_site ?? '')
    const [location, setLocation] = useState(job?.location ?? '')
    const [priority, setPriority] = useState(job?.priority ?? 0)
    const [labels, setLabels] = useState(job?.labels ?? '')
    const [url, setUrl] = useState(job?.link ?? '')

    return {
        position, description, companyName, location, priority, labels, url, companySite
    }
}

const Edit = () => {
    const router = useRouter();
    const client = useSupabaseClient<Database>();
    const { job: jobId } = router.query;
    const { position } = useJobEdit({})
    const [loading, setLoading] = useState(false)

    const handleFormSubmit = async (job: JobUpdateDTO) => {
        const { error } = await client.from('jobs').update({ ...job });
        if (error) { throw new Error(error.message, { cause: error.details }) }
    }

    if (loading) return <FullPageSpinner />

    return (
        <Layout>
            <button className="flex text-light-text mb-4 items-center" onClick={() => router.back()}>
                <ChevronLeft size={20} />
                Back
            </button>
            <JobForm
                job={{ position }}
                onSubmit={handleFormSubmit}
            />
        </Layout>
    )
}

export default Edit