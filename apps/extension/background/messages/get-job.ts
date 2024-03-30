import { type PlasmoMessaging } from "@plasmohq/messaging"
import { supabase as client } from "~core/supabase"

/**
 * handler for fetching job from the source_id
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const url = req.body.url;
    const { data, error } = await client.from("jobs").select().eq("link", url).maybeSingle()

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
