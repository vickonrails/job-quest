import { Layout } from '@components/layout'
import { useSession } from '@hooks';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { JobUpdateDTO, type Job, type JobInsertDTO } from 'lib/types';
import { useRouter } from 'next/router';
import React, { type FormEvent, useState, type HTMLAttributes, type FC } from 'react'
import { ChevronLeft } from 'react-feather';
import { Button, Input } from 'ui';
import clsx from 'clsx'

const NewJob = (job?: Job) => {
    const client = useSupabaseClient<Database>();
    const [session] = useSession();
    const router = useRouter()

    const createJob = async (job: JobInsertDTO) => {
        const { error } = await client.from('jobs').insert(job);
        if (error) { throw new Error(error.message, { cause: error.details }) }
    }

    return (
        <Layout session={session ?? undefined}>
            <button className="flex text-light-text mb-4 items-center" onClick={() => router.back()}>
                <ChevronLeft size={20} />
                Back
            </button>
            <JobForm onSubmit={createJob} />
        </Layout>
    )
}

// TODO: switch this up when I have a more standard way of doing forms
interface JobFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
    job?: JobUpdateDTO | JobInsertDTO
    onSubmit: (job: JobInsertDTO) => Promise<void>
}

export const JobForm: FC<JobFormProps> = ({ job, className, onSubmit, ...rest }) => {
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // TODO: replace when a form framework is implemented
    const [title, setTitle] = useState(job?.position ?? '')
    const [description, setDescription] = useState(job?.description ?? '')
    const [companyName, setCompanyName] = useState(job?.company_name ?? '')
    const [companySite, setCompanySite] = useState(job?.company_site ?? '')
    const [location, setLocation] = useState(job?.location ?? '')
    const [priority, setPriority] = useState(job?.priority ?? 0)
    const [labels, setLabels] = useState(job?.labels ?? '')
    const [url, setUrl] = useState(job?.link ?? '')

    const handleFormSubmit = (ev: FormEvent<HTMLFormElement>) => {
        if (submitting) return;
        ev.preventDefault();
        setSubmitting(true);

        onSubmit({
            position: title,
            company_name: companyName,
            status: 0,
            company_site: companySite,
            description: description,
            priority
        }).then(_ => {
            alert('Success');
        }).catch(err => {
            if (err instanceof Error) {
                setErrorMessage(err.message)
            }
            // 
        }).finally(() => {
            setSubmitting(false)
        })
    }

    return (
        <form onSubmit={handleFormSubmit}
            className={
                clsx('bg-white flex flex-col gap-2 p-4 max-w-md', className)
            }
            {...rest}
        >
            <Input value={title} fullWidth placeholder="Title" label="Title" onChange={ev => setTitle(ev.target.value)} />
            <Input value={companyName} fullWidth placeholder="Company Name" label="Company Name" onChange={ev => setCompanyName(ev.target.value)} />
            <Input value={companySite} fullWidth placeholder="Company site" label="Company site" onChange={ev => setCompanySite(ev.target.value)} />
            <Input type="number" min={1} max={5} fullWidth placeholder="Job Rating" label="Job Rating" value={priority} onChange={ev => setPriority(ev.target.value)} />
            <Input value={description} multiline fullWidth placeholder="Description" label="Description" onChange={ev => setDescription(ev.target.value)} />
            <Input value={location} fullWidth placeholder="Location" label="Location" onChange={ev => setLocation(ev.target.value)} />
            <Input value={labels} multiline fullWidth hint="Comma separated labels" placeholder="Labels" label="Labels" onChange={ev => setLabels(ev.target.value)} />
            <Input value={url} fullWidth type="url" placeholder="Link to Job" label="Link" onChange={ev => setUrl(ev.target.value)} />
            {errorMessage && <>{errorMessage}</>}
            <Button loading={submitting}>Create</Button>
        </form>
    )
}

export default NewJob