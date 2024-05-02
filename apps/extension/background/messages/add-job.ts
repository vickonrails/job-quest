import { type PlasmoMessaging } from '@plasmohq/messaging'
import type { User } from '@supabase/supabase-js'
import { v4 as uuid } from 'uuid'
import { supabase as client } from '~core/supabase'
import type { Job } from '~types'
import { authStorage } from './auth'

const handler: PlasmoMessaging.MessageHandler<Job & { notes: string }> = async (req, res) => {
  const { notes, ...job } = req.body
  const isNew = !Boolean(job.id)
  const { user } = await authStorage.get<{ user: User }>('session')

  if (!job.id) job.id = uuid();
  if (!job.status) job.status = 0;

  if (isNew) {
    const { data: count } = await client
      .from('jobs')
      .select('*')
      .eq('user_id', user.id)
      .order('order_column', { ascending: false }).eq('status', job.status)
      .limit(1)
      .single();

    const maxColumn = count?.order_column;
    job.order_column = maxColumn ? maxColumn + 10 : 10;
  }

  const { data, error } = await client.from('jobs').upsert({ ...job, user_id: user.id }).select().single();

  if (error) {
    res.send({
      success: false,
      error: error.message
    })
  }

  if (notes) {
    const { data: __, error: noteError } = await client.from('notes')
      .insert({ text: notes, user_id: user.id, job_id: data?.id, status: 0 })
    if (noteError) {
      res.send({
        success: false,
        error: noteError.message,
        job: data
      })
    }
  }

  res.send({
    success: true,
    job: data
  })
}

export default handler
