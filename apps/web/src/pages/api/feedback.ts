import { createClient as createApiClient } from '@lib/supabase/api';
import { createClient } from '@supabase/supabase-js';
import { type FeedbackFormValues } from '@utils/create-feedback';
import { type NextApiHandler } from 'next';
import { env } from '../../env.mjs';

const handler: NextApiHandler = async (req, res) => {
    const body = req.body as FeedbackFormValues;

    const client = createClient(
        env.FEEDBACK_URL,
        env.FEEDBACK_ANON_KEY
    );

    const appClient = createApiClient(req, res)
    try {
        const { data: { user }, error: authError } = await appClient.auth.getUser();
        if (authError) {
            throw authError;
        }

        const { content, mailMe: mail_me, reason: type } = body
        const { error } = await client.from('feedback').insert({
            content,
            mail_me,
            type,
            creator_id: user?.id,
            creator_email: user?.email
        });

        if (error) {
            throw error;
        }
        return res.send({ success: true })
    } catch (error) {
        return res.send({
            success: false,
            error
        })
    }
}

export default handler