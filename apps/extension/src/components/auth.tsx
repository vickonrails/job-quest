import { FormEvent, useState } from 'react'
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
                <button onClick={() => window.close()}>
                    <Cancel />
                </button>
            </div>
        </form>
    )
}
