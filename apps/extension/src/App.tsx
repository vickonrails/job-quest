import { client } from './supabase'
import './styles/globals.css'

import { FormEvent, useEffect, useState } from 'react';
import { Auth } from './components/auth';
import { Cancel } from './components/cancel';

interface Job {
  position: string,
  status: number,
  company_name: string,
  description?: string,
  location?: string
}

const useExtensionStorage = () => {
  const [credentials, setCredentials] = useState();

  useEffect(() => {
    const fetchDetails = async () => {
      const { authCredentials } = await chrome.storage.local.get(['authCredentials']);
      setCredentials(authCredentials);
    }

    fetchDetails();
  }, []);

  return [credentials];
}

function App() {
  const [credentials] = useExtensionStorage();
  const [hasNotes, setHasNotes] = useState(false);

  const [position, setPosition] = useState('')
  const [company_name, setCompanyName] = useState('')
  const [location, setLocation] = useState('')
  const [description, setDescription] = useState('')
  const [note, setNote] = useState('')

  const [addingJob, setAddingJob] = useState(false)

  useEffect(() => {
    // 
  }, [credentials])

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
      const { error } = await client.from('jobs').insert(job);
      if (error) {
        throw error;
      }
      setAddingJob(false)
      window.close()
    } catch (err) {
      setAddingJob(false)
      alert(`${JSON.stringify(err)} error occurred`);
    }

    // TODO: Create a new job entry
  }

  if (!credentials) {
    return <Auth />
  }

  return (
    <main className="max-w-xs p-4 w-80 bg-violet-50">
      <div className="flex align-middle justify-between mb-6" >
        <p>Create New Entry</p>
        <button onClick={() => window.close()}>
          <Cancel />
        </button>
      </div>
      <form onSubmit={handleCreateJob}>
        <input
          className="mb-7"
          value={position}
          onChange={(ev) => setPosition(ev.target.value)}
          placeholder="Fill in the position of the position here"
        />
        <input
          value={company_name}
          onChange={(ev) => setCompanyName(ev.target.value)}
          placeholder="Company Name"
        />
        <input
          value={location}
          onChange={(ev) => setLocation(ev.target.value)}
          placeholder="Remote?"
        />
        <input
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          placeholder="Past application here"

        />

        {hasNotes ? (
          <input
            value={note}
            onChange={(ev) => setNote(ev.target.value)}
            placeholder="Notes"
          />
        ) : (
          <button
            className="mb-4"
            onClick={() => setHasNotes(true)}
          >
            Add Note
          </button>
        )}

        <button className="mb-4">
          Add to JobQuest
        </button>
        <button>View all Applications</button>
      </form>
    </main >
  )
}

export default App
