import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { type NextApiHandler } from 'next';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const context = `
    You're an assistant that generates relevant keywords (most likely to be indexing in an ATS) from a job description.
    I'll provide you with a job description, and you will reply with a javascript (no escaping) array of keywords that are relevant to the job description & the job title.
    Leave out filler keywords, but include relevant industry keywords, skills, and technologies.

    Example:
    job description ...

    Response:
    ["Keyword 1", "Keyword 2"]
`;

const handler: NextApiHandler = async (req, res) => {
    const request = req.body as { description: string }
    if (process.env.OPENAI_API_KEY === undefined) {
        return res.status(500).json({ error: 'OpenAI key not provided' })
    }

    const supabase = createPagesServerClient({ req, res })
    const { data, error } = await supabase.auth.getSession();

    if (error) return res.status(500).json({ error: 'An error occurred' })

    if (!data.session) {
        return res.status(401).json({ error: 'You are not authorized to perform this action' });
    }
    const { description } = request

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages: [
                { role: 'system', content: context },
                { role: 'user', content: JSON.stringify(description) },
            ]
        });
        const response = completion?.choices?.[0]?.message.content;

        if (!response) {
            return res.status(500).json({ error: 'An error occurred' });
        }

        const parsedResponse = JSON.parse(response) as string[]
        return res.status(200).json({ keywords: parsedResponse });
    } catch {
        return res.status(500).json({ error: 'An error occurred' });
    }
}

export default handler