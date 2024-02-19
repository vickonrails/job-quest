import { type PlasmoMessaging } from "@plasmohq/messaging"
import { supabase as client } from "~core/supabase"
import type { Job } from "~types"
import { v4 as uuid } from 'uuid'

const handler: PlasmoMessaging.MessageHandler<Job & { notes: string }> = async (req, res) => {
  const userId = 'f589f572-6cf1-4636-a900-ace2653918f4'
  const { notes, ...job } = req.body

  if (!job.id) {
    job.id = uuid();
  }

  const { data, error } = await client.from("jobs").upsert({ ...job, user_id: userId }).select().single() :

  if (error) {
    res.send({
      success: false,
      error: error.message
    })
  }

  if (notes) {
    const { data: __, error: noteError } = await client.from("notes").insert({ text: notes, job_id: job?.id, user_id: userId, status: 0 })
    if (noteError) {
      res.send({
        success: false,
        error: noteError.message
      })
    }
  }

  res.send({
    success: true
  })
}

export default handler
