import type { PlasmoMessaging } from '@plasmohq/messaging';
import { Storage } from '@plasmohq/storage';
import { supabase as client } from '~core/supabase';
import { authenticateUser } from '~utils/authenticate-user';

interface RequestBody {
    action: 'navigate-to-auth' | 'exchange-code-for-session'
    code?: string
}

export const authStorage = new Storage()

const handler: PlasmoMessaging.MessageHandler<RequestBody> = async (req, res) => {
    const { body } = req;
    switch (body.action) {
        case 'navigate-to-auth':
            await authenticateUser()
            break;

        case 'exchange-code-for-session':
            const { code } = body
            try {
                const session = await client.auth.exchangeCodeForSession(String(code));
                await authStorage.set('session', session.data)

                const { data: { user } } = await client.auth.getUser()
                if (!user) throw new Error('Authentication failed')
                const { error } = await client.from('profiles').update({ has_tried_browser_extension: true }).eq('id', user.id)
                if (error) throw error
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