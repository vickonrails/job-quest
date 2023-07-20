import { FormEvent, useState } from 'react'
import { Button, Input, Typography } from 'ui';
import { Cancel } from './cancel';

type Credentials = {
    url: string,
    token: string
}

const storeCredentials = async (credentials: Credentials) => {
    try {
        // eslint-disable-next-line no-debugger
        debugger
        await chrome.storage.local.set({ authCredentials: { ...credentials } });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(JSON.stringify(err));
    }
}

export const Auth = () => {
    const [URL, setURL] = useState('')
    const [token, setToken] = useState('')

    const handleAuth = async (ev: FormEvent) => {
        ev.preventDefault();
        await storeCredentials({ url: URL, token });
    }

    return (
        <form onSubmit={handleAuth} className="max-w-xs p-4 w-80 bg-violet-50">
            <div className="flex align-middle justify-between mb-6" >
                <Typography variant="body-sm" as="h1">Create New Entry</Typography>
                <button onClick={() => window.close()}>
                    <Cancel />
                </button>
            </div>
            <Input
                value={URL}
                fullWidth
                onChange={ev => setURL(ev.target.value)}
                placeholder="Enter site url"
                label="Site URL"
                hint="Enter the supabase URL. It's normally the shorter credential and ends in supabase.co"
            />
            <Input
                value={token}
                fullWidth
                onChange={ev => setToken(ev.target.value)}
                placeholder="Enter auth token"
                label="Auth Token"
                hint="The more longer token"
                multiline
            />
            <Button fullWidth>Authenticate</Button>
        </form>
    )
}
