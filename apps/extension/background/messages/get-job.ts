import { type PlasmoMessaging } from "@plasmohq/messaging"
import { supabase as client } from "~core/supabase"

/**
 * handler for fetching job from the source_id
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const sourceId = req.body.id;
    const { data, error } = await client.from("jobs").select().eq("source", "linkedIn").eq("source_id", sourceId).maybeSingle()

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
