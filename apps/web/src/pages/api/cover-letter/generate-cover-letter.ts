import { type NextApiHandler } from 'next';
import { OpenAI } from 'openai';

import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const context = `
    You are a professional cover letter writer. 
    I will provide you with a candidate's background and the job description and you will reply with a cover letter tailored to that job description. 
    You will leverage a candidate's background (professional experience, education, skills etc) and 
    the job description to provide a short and crisp cover letter that can talk about past experiences and how they can be of value to the receiving company. 
    The goal is to be convincing, a little proud, and straight to the point. Basically show how the candidate can be a great fit for the job.
`;

const handler: NextApiHandler = async (req, res) => {
    if (process.env.OPENAI_API_KEY === undefined) {
        return res.status(500).json({ error: 'OpenAI key not provided' })
    }

    const supabase = createPagesServerClient({ req, res })
    const { data, error } = await supabase.auth.getSession();

    if (error) return res.status(500).json({ error: 'An error occurred' })

    if (!data.session) {
        return res.status(401).json({ error: 'You are not authorized to perform this action' });
    }

    const { jobDescription, education, workExperience, skills, jobTitle, professionalSummary } = req.body

    const input = {
        jobDescription,
        jobTitle,
        background: {
            education,
            workExperience,
            skills,
            professionalSummary
        }
    }

    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages: [
                { role: 'system', content: context },
                { role: 'user', content: JSON.stringify(input) },
            ]
        });

        let response = completion?.choices?.[0]?.message.content;
        return res.status(200).json({ coverLetter: response });
    } catch {
        return res.status(500).json({ error: 'An error occurred' });
    }
}

export default handler