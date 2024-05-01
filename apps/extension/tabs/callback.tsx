import { sendToBackground } from '@plasmohq/messaging';
import { useEffect, useState } from 'react';

import { Spinner } from 'ui';
import '../styles/global.css';

type AuthState = 'loading' | 'success' | 'error'
function CallbackHandler() {
    const [state, setState] = useState<AuthState>('loading');

    useEffect(() => {
        const currentURL = new URL(window.location.href);
        const searchParams = currentURL.searchParams;
        const code = searchParams.get('code');

        if (code) {
            sendToBackground({
                name: 'auth',
                body: {
                    action: 'exchange-code-for-session',
                    code
                }
            }).then(_ => {
                setState('success')
                setTimeout(() => {
                    window.close();
                }, 2000)
            }).catch(_ => {
                setState('error')
            })
        }
    }, [])

    switch (state) {
        case 'error':
            return <Error />

        case 'success':
            return <Success />
    }

    return (
        <p>Loading...</p>
    )
}

// TODO: return to the last page after the authentication process.
function Success() {
    return (
        <div className="page flex items-center gap-2 flex-col py-6">
            <Spinner variant="primary" />
            <h1 className="text-center text-xl font-medium">Authentication Successful</h1>
            <p className="text-center text-lg text-muted-foreground">Page will close soon</p>
        </div>
    )
}

function Error() {
    return (
        <div className="page">
            <p>An error occurred</p>
        </div>
    )
}

export default CallbackHandler