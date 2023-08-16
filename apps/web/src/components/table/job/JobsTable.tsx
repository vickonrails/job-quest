import React, { useState } from 'react'
import { type EditJobFormProps, Table, type TableActions, type Column } from '../Table'
import { useJobs } from '@hooks'
import { FullPageSpinner } from '@components/spinner'
import { Sheet } from '@components/sheet'
import { type Database } from 'lib/database.types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { type Job } from 'lib/types'
import { Button, Input } from 'ui'

export const Status_Lookup = [
    'Bookmarked',
    'Applying',
    'Applied',
    'Interviewing',
    'Rejected',
    'Negotiating',
    'Hired',
]

const columns: Column<Job> = [
    { header: 'Company Name', type: 'logoWithText', renderValue: (item) => ({ src: `https://logo.clearbit.com/${item.company_site}`, text: item.company_name }) },
    { header: 'Position', type: 'text', renderValue: (item) => ({ text: item.position }) },
    { header: 'Status', type: 'text', renderValue: (item) => ({ text: Status_Lookup[item.status] ?? '' }) },
    { header: 'Rating', type: 'rating', renderValue: (item) => ({ rating: item.priority ?? 0 }) },
    { header: 'Date', type: 'date', renderValue: (item) => ({ date: item.created_at ?? '' }) },
]

const JobsTable = () => {
    const { loading, jobs, refreshing, refresh } = useJobs();
    const client = useSupabaseClient<Database>();
    // const [detailOpen, setDetailOpen] = useState(false)

    const router = useRouter();

    const onDelete = async (jobId: string) => {
        const { error } = await client.from('jobs').delete().eq('id', jobId);
        if (error) { throw error }
    }

    const onEditClick = (id: string) => {
        // setDetailOpen(true)
        // router.push(`/app/tracker/jobs/${id}/edit`).then(() => {
        //     // 
        // }).catch(err => {
        //     // 
        // })
    }

    const onRowClick = (id: string) => {
        router.push(`/app/jobs/${id}`).then(() => {
            // 
        }).catch(err => {
            // 
        })
    }

    const actions: TableActions = {
        onDelete,
        // onEditClick,
        refresh,
        onRowClick
    }

    if (loading) { return <FullPageSpinner /> }

    return (
        <>
            <Table<Job>
                columns={columns}
                data={jobs}
                actions={actions}
                disabled={refreshing}
                EditForm={EditJobForm}
            />
            {/* <Sheet open={detailOpen} onOpenChange={setDetailOpen} /> */}
        </>
    )
}


// TODO: Take this off
const EditJobForm = (props: EditJobFormProps<Job>) => {
    const [position, setTitle] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [companySite, setCompanySite] = useState('')
    const [priority, setPriority] = useState(0)
    const [location, setLocation] = useState('')
    const [labels, setLabels] = useState('')
    const [url, setURL] = useState('')
    const [submitting, setSubmitting] = useState(false)

    return (
        <form>
            <Input value={position} fullWidth placeholder="Title" label="Title" onChange={ev => setTitle(ev.target.value)} />
            <Input value={companyName} fullWidth placeholder="Company Name" label="Company Name" onChange={ev => setCompanyName(ev.target.value)} />
            <Input value={companySite} fullWidth placeholder="Company site" label="Company site" onChange={ev => setCompanySite(ev.target.value)} />
            <Input type="number" min={1} max={5} fullWidth placeholder="Job Rating" label="Job Rating" value={priority} onChange={ev => setPriority(Number.parseInt(ev.target.value))} />
            <Input value={location} fullWidth placeholder="Location" label="Location" onChange={ev => setLocation(ev.target.value)} />
            <Input value={labels} multiline fullWidth hint="Comma separated labels" placeholder="Labels" label="Labels" onChange={ev => setLabels(ev.target.value)} />
            <Input value={url} fullWidth type="url" placeholder="Link to Job" label="Link" onChange={ev => setURL(ev.target.value)} />
            {/* {errorMessage && <>{errorMessage}</>} */}
            <Button loading={submitting}>Create</Button>
        </form>
    )
}

export default JobsTable
