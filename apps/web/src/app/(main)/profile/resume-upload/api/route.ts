import { createClient } from '@/utils/supabase/server';
import { Project, type ProjectInsertDTO, type EducationInsertDTO, type ProfileInsertDTO, type WorkExperienceInsertDTO, type WorkExperience } from 'lib/types';
import { revalidateTag } from 'next/cache';
import OpenAI from 'openai';
import { ChatCompletion, type ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { parse } from 'path';
import parsePDF from 'pdf-parse/lib/pdf-parse.js';

interface ResponseFormat {
    profile: ProfileInsertDTO
    workExperience: WorkExperienceInsertDTO[]
    education: EducationInsertDTO[]
    projects: ProjectInsertDTO[]
}

// const profile = {
//     email_address: '',
//     full_name: 'Jordan Smith',
//     github_url: '',
//     id: '6479241a-7e1f-40a8-9928-84447674f8d2',
//     linkedin_url: '',
//     location: '',
//     personal_website: '',
//     professional_summary: 'Software developer with 5 years of experience developing innovative applications, seeking to leverage programming skills to solve complex problems.',
//     skills: [{ label: 'Javascript' }],
//     title: 'Software Developer',
// }

type WorkExperienceDTO = Omit<WorkExperience, 'id' | 'resume_id' | 'created_at' | 'updated_at'>;

// const workExperiences: WorkExperienceDTO[] = [
//     {
//         company_name: 'TechInnovations Inc.',
//         end_date: null,
//         job_title: 'Software Developer',
//         location: '',
//         start_date: '2021-01-01',
//         still_working_here: true,
//         user_id: '6479241a-7e1f-40a8-9928-84447674f8d2'
//     },
//     {
//         company_name: 'NextGen Solutions',
//         end_date: '2021-05-31',
//         job_title: 'Junior Software Developer',
//         location: '',
//         start_date: '2019-07-01',
//         still_working_here: false,
//         user_id: '6479241a-7e1f-40a8-9928-84447674f8d2'
//     }
// ]

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

function getInstruction(resumeText: string) {
    const system: ChatCompletionMessageParam = {
        role: 'system',
        content: 'You are a highly accurate and detail-oriented assistant that extracts structured data from resumes. Follow the provided JSON format strictly. If any field is missing in the resume, leave it empty or use default values like empty strings or false for boolean values.'
    };

    const user: ChatCompletionMessageParam = {
        role: 'user',
        content: `Extract the following structured JSON data from the provided resume. Ensure that all fields are accurately filled based on the available information. 
        If certain details are not present, leave them as empty strings or default values. 
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
          "workExperience": [{
              "job_title": "",
              "location": "",
              "company_name": "",
              "end_date": YYYY-MM-DD or null,
              "start_date": YYYY-MM-DD or null,
              "still_working_here": false
          }],
          "education": [{
              "start_date": YYYY-MM-DD or null,
              "end_date": YYYY-MM-DD or null,
              "degree": "",
              "field_of_study": "",
              "institution": "",
              "still_studying_here": boolean,
              "location": ""
          }],
          "projects": [{
              "description": "",
              "end_date": YYYY-MM-DD or null,
              "start_date": YYYY-MM-DD or null,
              "skills": [{"label": ""}],
              "title": "",
              "url": ""
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
    // TODO: this is going to erase data from previous resume in order to avoid duplicates or other complex situations
    const { data, error } = await client.auth.getUser()
    if (!data || error) throw error;

    const arrayBuffer = await request.arrayBuffer();

    try {
        const buffer = Buffer.from(arrayBuffer);
        const { text } = await parsePDF(buffer)
        const instructions = getInstruction(text)
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages: instructions
        });
        const response = completion.choices[0]?.message.content
        if (!response) throw new Error('No response from GPT')

        const gptResponse: ResponseFormat = JSON.parse(response)
        const { profile, workExperience, projects, education } = gptResponse

        if (profile && workExperience && projects) {
            const enrichedProjects = projects.map((project) => ({ ...project, user_id: data.user.id }))
            const enrichedExperience = workExperience.map((we) => ({ ...we, user_id: data.user.id }))
            const enrichedEducation = education.map((edu) => ({ ...edu, user_id: data.user.id }))

            const { error } = await client.rpc('setup_profile', {
                profile,
                work_experience: enrichedExperience,
                projects: enrichedProjects,
                education: enrichedEducation,
                user_id: data.user.id
            })

            if (error) throw error

            await client.from('profiles').update({ is_profile_setup: true }).eq('id', data.user.id)

            revalidateTag(`profile-${data.user.id}`)
            revalidateTag('workExperiences')
            revalidateTag('projects')
            revalidateTag('education')
        }

        return Response.json({ success: true })

    } catch (e) {
        return Response.json({ success: false, error: e }, { status: 501 })
    }
}