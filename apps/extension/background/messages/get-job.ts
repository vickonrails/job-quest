import { type PlasmoMessaging } from "@plasmohq/messaging"
import { supabase as client } from "~core/supabase"

/**
 * handler for fetching job from the source_id
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    console.log(req.body)
    const { data, error } = await client.from("jobs").select().eq("source_id", req.body.id).eq("source", "linkedin").single()

    if (error || !data) {
        res.send({
            success: false,
            error: error.message,
        })
    }

    return res.send({
        success: true,
        data: { job: data },
    })
}

export default handler
