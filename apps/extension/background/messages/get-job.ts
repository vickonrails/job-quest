import { type PlasmoMessaging } from '@plasmohq/messaging'
import { supabase as client } from '~core/supabase'
import { authStorage } from './auth'
import type { User } from '@supabase/supabase-js';

/**
 * handler for fetching job from the source_id
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const url = req.body.url;
    const { user } = await authStorage.get<{ user: User }>('session')

    const { data, error } = await client.from('jobs')
        .select().eq('link', url)
        .eq('user_id', user.id)
        .maybeSingle()

    if (error || !data) {
        res.send({
            success: false,
            error: error ? error.message : '',
        })
    }

    return res.send({
        success: true,
        data: { job: data },
    })
}

export default handler
