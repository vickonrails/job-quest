import { type PlasmoMessaging } from "@plasmohq/messaging"
import { supabase as client } from "~core/supabase"

/**
 * handler for fetching job from the source_id
 */
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const { data, error } = await client.from("jobs").select().eq("source_id", req.body.id).eq("source", "linkedin")
    if (error) {
        res.send({
            success: false,
            error: error.message,
        })
        throw new Error(error.message, { cause: error.details })
    }

    res.send({
        success: true,
        data: { job: data[0] },
    })
}

export default handler
