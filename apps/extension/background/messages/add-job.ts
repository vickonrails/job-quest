import { sendToContentScript, type PlasmoMessaging } from "@plasmohq/messaging"
import { supabase } from "~core/supabase"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { company_name, position, description, link } = req.body
  const { data, error } = await supabase.from("jobs").insert({ company_name, position, status: 1, description, link })
  if (error) {
    throw new Error(error.message, { cause: error.details })
  }
}

export default handler
