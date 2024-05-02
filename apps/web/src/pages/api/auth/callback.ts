import { createClient } from '@lib/supabase/api'
import { type NextApiHandler } from 'next'

// TODO: is there suppose to be any type of error handling here?
const handler: NextApiHandler = async (req, res) => {
    const { code } = req.query

    if (code) {
        const supabase = createClient(req, res)
        await supabase.auth.exchangeCodeForSession(String(code))
    }

    res.redirect('/')
}

export default handler