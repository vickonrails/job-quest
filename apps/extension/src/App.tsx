import { Button, Input, Typography } from 'ui';
import { client } from './supabase'
import './styles/globals.css'

import 'ui/dist/styles.css';
import { FormEvent, useState } from 'react';

interface Job {
  position: string,
  status: number,
  company_name: string,
  description?: string,
  location?: string
}

function App() {
  const [hasNotes, setHasNotes] = useState(false);

  const [position, setPosition] = useState('')
  const [company_name, setCompanyName] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [note, setNote] = useState('')

  const [addingJob, setAddingJob] = useState(false)

  const handleCreateJob = async (ev: FormEvent) => {
    setAddingJob(true)
    ev.preventDefault();
    const job: Job = {
      position,
      company_name,
      location,
      description,
      status: 0
    }

    try {
      const { data, error } = await client.from('jobs').insert(job);
      if (error) {
        throw error;
      }
      alert(JSON.stringify(data));
      setAddingJob(false)
    } catch (err) {
      setAddingJob(false)
      alert(`${JSON.stringify(err)} error occurred`);
    }

    // TODO: Create a new job entry
  }

  return (
    <main className="max-w-xs p-4 w-80 bg-violet-50">
      <div className="flex align-middle justify-between mb-6" >
        <Typography variant="body-sm" as="h1">Create New Entry</Typography>
        <button>x</button>
      </div>
      <form onSubmit={handleCreateJob}>
        <Input
          className="mb-7"
          value={position}
          fullWidth size="sm"
          onChange={(ev) => setPosition(ev.target.value)}
          label="Position"
          placeholder="Fill in the position of the position here"
        />
        <Input
          fullWidth
          size="sm"
          value={company_name}
          onChange={(ev) => setCompanyName(ev.target.value)}
          label="Company/Organization"
          placeholder="Company Name"
        />
        <Input
          fullWidth
          value={location}
          onChange={(ev) => setLocation(ev.target.value)}
          size="sm"
          label="Location"
          placeholder="Remote?"
        />
        <Input
          fullWidth
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          size="sm"
          label="Description"
          placeholder="Past application here"
          multiline
        />

        {hasNotes ? (
          <Input
            fullWidth
            size="sm"
            label="Notes"
            value={note}
            onChange={(ev) => setNote(ev.target.value)} placeholder="Notes"
            multiline
          />
        ) : (
          <Button
            className="mb-4"
            size="sm"
            fillType="text"
            onClick={() => setHasNotes(true)}
          >
            Add Note
          </Button>
        )}

        <Button type="submit" loading={addingJob} className="mb-4" size="sm" fullWidth>
          Add to JobQuest
        </Button>
        <Button size="sm" fillType="text" fullWidth>View all Applications</Button>
      </form>
    </main >
  )
}

export default App
