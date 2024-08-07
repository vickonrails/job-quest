import { createClient } from '@/utils/supabase/server';
import { resumeSchema } from '@/utils/resume-schema';
import { openai } from '@ai-sdk/openai';
import { type CoreMessage, streamObject } from 'ai';
import parsePDF from 'pdf-parse/lib/pdf-parse.js';
import { base64ToArrayBuffer } from '@/utils/base64-arraybuffer';

export const maxDuration = 80

function getInstruction(resumeText: string) {
    const system: CoreMessage = {
        role: 'system',
        content: 'You are a highly accurate and detail-oriented assistant that extracts structured data from resumes. Follow the provided JSON format strictly. If any field is missing in the resume, leave it empty or use default values like empty strings or false for boolean values.'
    };

    const user: CoreMessage = {
        role: 'user',
        content: `Extract the following structured JSON data from the provided resume. Ensure that all fields are accurately filled based on the available information. 
        If certain details are not present or incorrect (date, etc), leave them as empty strings or default values. 
        The format for the response should be strictly JSON and include no other text. 
        Respond straight up with {}, and not any code formatting. Your reply will be used directly in the codebase and not presented in a <code> tag, so just return json. 
        The format for the response should be:
      
      {
          "profile": {
              "full_name": "",
              "email_address": "",
              "location": "",
              "professional_summary": "",
              "title": "",
              "skills": [{"label": ""}],
              "github_url": "",
              "personal_website": "",
              "linkedin_url": ""
          },
          "work_experience": [{
              "job_title": "",
              "location": "",
              "company_name": "",
              "end_date": date or null,
              "start_date": date or null,
              "still_working_here": false,
              "highlights": "<ul><li>Highlights into an unordered list</li></ul>"
          }],
          "education": [{
              "start_date": date or null,
              "end_date": date or null,
              "degree": "",
              "field_of_study": "",
              "institution": "",
              "still_studying_here": boolean,
              "location": "",
              "highlights": "<ul><li>Highlights into an unordered list</li></ul>"
          }],
          "projects": [{
              "highlights": "<ul><li>Highlights into an unordered list</li></ul>",
              "end_date": date or null,
              "start_date": date or null,
              "skills": [{"label": ""}],
              "title": "",
              "url": "",
          }]
      }
      
      Resume:
      ${resumeText}
      
      Respond only with the JSON content and nothing else.`
    }

    return [system, user]
}

export async function POST(request: Request) {
    const client = createClient();
    const { data, error } = await client.auth.getUser()
    if (!data || error) throw error;

    const { file } = await request.json();
    const arrayBuffer = base64ToArrayBuffer(file)

    try {
        const buffer = Buffer.from(arrayBuffer);
        const { text } = await parsePDF(buffer)
        const instructions = getInstruction(text)

        const result = await streamObject({
            model: openai('gpt-4-turbo'),
            messages: [...instructions],
            schema: resumeSchema
        });

        return result.toTextStreamResponse()
    }

    catch (e) {
        if (e instanceof Error) {
            return Response.json({ success: false, error: e.message }, { status: 501 })
        }
    }
}