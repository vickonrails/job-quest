import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';
import { supabase as client } from '~core/supabase';

interface RequestBody {
    action: 'navigate-to-auth' | 'exchange-code-for-session'
    code?: string
}

const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, res) => {
    const { body } = req;

    const storage = new Storage()
    switch (body.action) {
        case 'navigate-to-auth':
            await chrome.tabs.create({
                url: 'tabs/auth.html'
            })
            break;

        case 'exchange-code-for-session':
            const { code } = body
            try {
                const session = await client.auth.exchangeCodeForSession(String(code));
                await storage.set('session', session)
                res.send({
                    success: true
                })
            } catch {
                res.send({
                    success: false
                })
            }
    }
}

export default handler