import { type PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from '@plasmohq/storage'
import { supabase as client } from "~core/supabase"

// TODO: is it possible to export the types from supabase into the ui package so it can be reused here?
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log(req)
  const { data: { user } } = await client.auth.getUser();

  if (!user) throw new Error("User not found");
  const { data: _, error } = await client.from("jobs").insert({ ...req.body, user_id: user.id })
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
