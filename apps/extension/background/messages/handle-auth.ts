import { type PlasmoMessaging } from "@plasmohq/messaging"
import { supabase as client } from "~core/supabase"
import { Storage } from '@plasmohq/storage'

/**
 * handler for fetching job from the source_id
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    // why do I need to save the token, I just need to sign in with JWT token
    // console.log(`Received message`)
    const { session } = req.body
    const storage = new Storage();
    await storage.set('auth', session);

    client.auth.setSession({ access_token: session.access_token, refresh_token: session.refresh_token });
}

export default handler