import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { getMonorepoRoot } from '@utils/find-mono-repo-root';
import { readFileSync } from 'fs';
import { type NextApiHandler } from 'next';
import path from 'path';

const apiServiceURL = process.env.NEXT_PUBLIC_API_SERVICE_URL as string;

const handler: NextApiHandler = async (req, res) => {
    const { html } = req.body as { html: string }

    if (process.env.OPENAI_API_KEY === undefined) {
        return res.status(500).json({ error: 'OpenAI key not provided' })
    }

    const monorepoRoot = getMonorepoRoot()
    const supabase = createPagesServerClient({ req, res })
    const { data, error } = await supabase.auth.getSession();
    if (error) return res.status(500).json({ error: 'An error occurred' })

    if (!data.session) {
        return res.status(401).json({ error: 'You are not authorized to perform this action' });
    }

    const cssFilePath = path.join(monorepoRoot, 'packages/resume-templates/dist/styles.css');
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