import { type PlasmoMessaging } from "@plasmohq/messaging"
import { supabase as client } from "~core/supabase"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { data: _, error } = await client.from("jobs").insert(req.body)
  if (error) {
    res.send({
      success: false,
      error: error.message,
    })
    throw new Error(error.message, { cause: error.details })
  }

  res.send({
    success: true
  })
}

export default handler
