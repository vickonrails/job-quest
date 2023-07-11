import { Button, Input, Typography } from 'ui';
import './styles/globals.css'

import 'ui/dist/styles.css';
import { FormEvent, useState } from 'react';

function App() {
  const [hasNotes, setHasNotes] = useState(false);

  const [title, setTitle] = useState('Software Engineer')
  const [company, setCompany] = useState('Goggle')
  const [location, setLocation] = useState('Remote')
  const [description, setDescription] = useState('This is a description. Not sure what to do about it')
  const [note, setNote] = useState('')

  const handleCreateJob = (ev: FormEvent) => {
    ev.preventDefault();

    console.log({
      title,
      company,
      location,
      description,
      note
    })
  }

  return (
    <main className='max-w-xs p-4 bg-violet-50'>
      <div className='flex align-middle justify-between mb-6' >
        <Typography variant='body-lg-md' as='h1'>Create New Entry</Typography>
        <button>x</button>
      </div>
      <form onSubmit={handleCreateJob}>
        <Input
          className='mb-7'
          value={title}
          fullWidth size='sm'
          onChange={(ev) => setTitle(ev.target.value)}
          label='Title'
          placeholder='Fill in the title of the position here'
        />
        <Input
          fullWidth
          size='sm'
          value={company}
          onChange={(ev) => setCompany(ev.target.value)}
          label='Company/Organization'
          placeholder='Company Name'
        />
        <Input
          fullWidth
          value={location}
          onChange={(ev) => setLocation(ev.target.value)}
          size='sm'
          label='Location'
          placeholder='Remote?'
        />
        <Input
          fullWidth
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          size='sm'
          label='Description'
          placeholder='Past application here'
        />

        {hasNotes ? (
          <Input
            fullWidth
            size='sm'
            label='Notes'
            value={note}
            onChange={(ev) => setNote(ev.target.value)} placeholder='Notes'
          />
        ) : (
          <Button className='mb-4' size='sm' onClick={() => setHasNotes(true)}>
            Add Note
          </Button>
        )}

        <Button type='submit' className='mb-4' size='sm' fullWidth>Add to JobQuest</Button>
        <Button size='sm' fullWidth>View all Applications</Button>
      </form>
    </main >
  )
}

export default App
