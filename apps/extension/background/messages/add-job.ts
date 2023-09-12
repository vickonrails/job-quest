import { type PlasmoMessaging } from "@plasmohq/messaging"
import { supabase as client } from "~core/supabase"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { company_name, position, description, link, priority } = req.body
  const { data, error } = await client.from("jobs").insert({ company_name, position, status: 0, description, link, priority })
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
