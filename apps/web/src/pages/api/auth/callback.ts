import { type NextApiHandler } from 'next'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'

// TODO: is there suppose to be any type of error handling here?
const handler: NextApiHandler = async (req, res) => {
    const { code } = req.query

    if (code) {
        const supabase = createPagesServerClient({ req, res })
        await supabase.auth.exchangeCodeForSession(String(code))
    }

    res.redirect('/')
}

export default handler