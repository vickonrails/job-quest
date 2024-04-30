import { sendToBackground } from '@plasmohq/messaging';
import { type NextApiHandler } from 'next';
import { useEffect, useState } from 'react';

type AuthState = 'loading' | 'success' | 'error'
const Handler: NextApiHandler = () => {
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
            }).catch(_ => {
                setState('error')
            })
        }
    }, [])

    switch (state) {
        case 'error':
            return <p>An error occurred</p>

        case 'success':
            return <p>You can now close this page</p>
    }

    return (
        <p>Loading...</p>
    )
}

export default Handler