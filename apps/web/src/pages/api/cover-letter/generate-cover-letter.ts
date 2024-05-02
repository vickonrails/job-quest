import { createClient } from '@lib/supabase/api';
import { type NextApiHandler, type NextApiRequest } from 'next';
import { OpenAI } from 'openai';
import { type WriteProps } from 'src/hooks/useMagicWrite';

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

type Request = NextApiRequest & { body: WriteProps }

const handler: NextApiHandler = async (req: Request, res) => {
    const request = req.body as WriteProps
    if (process.env.OPENAI_API_KEY === undefined) {
        return res.status(500).json({ error: 'OpenAI key not provided' })
    }

    const supabase = createClient(req, res)
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) return res.status(500).json({ error: 'An error occurred' })

    if (!user) {
        return res.status(401).json({ error: 'You are not authorized to perform this action' });
    }

    const { jobDescription, education, workExperience, skills, jobTitle, professionalExperience } = request

    const input = {
        jobDescription,
        jobTitle,
        background: {
            education,
            workExperience,
            skills,
            professionalExperience
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

        const response = completion?.choices?.[0]?.message.content;
        return res.status(200).json({ coverLetter: response });
    } catch {
        return res.status(500).json({ error: 'An error occurred' });
    }
}

export default handler