import { createClient } from '@lib/supabase/api'
import { type NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
    const { code } = req.query

    if (code) {
        const supabase = createClient(req, res)
        await supabase.auth.exchangeCodeForSession(String(code))
    }

    res.redirect('/')
}

export default handler