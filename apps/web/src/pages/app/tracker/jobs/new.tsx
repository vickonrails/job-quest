import { Layout } from '@components/layout'
import { useSession } from '@hooks';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from 'lib/database.types';
import { type JobInsertDTO } from 'lib/types';
import React, { type FormEvent, useState } from 'react'
import { Button, Input } from 'ui';


const NewJob = () => {
    const client = useSupabaseClient<Database>();
    const [session] = useSession();

    const createJob = async (job: JobInsertDTO) => {
        const { data, error } = await client.from('jobs').insert(job);
        if (error) { throw new Error(error.message, { cause: error.details }) }
        return data;
    }

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [companySite, setCompanySite] = useState('')
    const [location, setLocation] = useState('')
    const [priority, setPriority] = useState(1)
    const [labels, setLabels] = useState('')
    const [url, setUrl] = useState('')
    const [submitting, setSubmitting] = useState(false)

    const [errorMessage, setErrorMessage] = useState('')

    const onCreate = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        setSubmitting(true);

        createJob({
            position: title,
            company_name: companyName,
            status: 0,
            company_site: companySite,
            description: description,
            priority
        }).then(_ => {
            alert('Job added');
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
        <Layout session={session ?? undefined} >
            <form onSubmit={onCreate} className="bg-white flex flex-col gap-2 p-4 max-w-md">
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
        </Layout>
    )
}

export default NewJob