import { createClient } from '@/utils/supabase/server';
import { readFileSync } from 'fs';
import { type NextApiHandler } from 'next';
import path from 'path';

const apiServiceURL = process.env.API_SERVICE_URL as string;

const handler: NextApiHandler = async (req, res) => {
    const { html } = req.body as { html: string }
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return res.status(500).json({ error: 'An error occurred' })

    if (!user) {
        return res.status(401).json({ error: 'You are not authorized to perform this action' });
    }

    const cssFilePath = path.join(process.cwd(), 'src/styles/resume-templates.css');
    const cssString = readFileSync(cssFilePath, 'utf8');
    try {
        const endpoint = `${apiServiceURL}/api/resume-export`
        const response = await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({ html, style: cssString }),
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await response.arrayBuffer();
        res.setHeader('Content-Type', 'application/pdf');
        return res.send(Buffer.from(data));
    } catch (e) {
        if (e instanceof Error) {
            return res.status(500).json({ error: e.message })
        }
    }
}

export default handler