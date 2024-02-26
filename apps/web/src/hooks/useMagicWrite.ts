import { useState } from 'react'

export interface WriteProps {
    jobDescription: string
    professionalExperience: string
    jobTitle: string
    skills?: string[] | null
    workExperience: { company_name: string | null, job_title: string | null, highlights: { text: string }[] }[]
    education: { institution: string | null, degree: string | null, field_of_study: string | null, highlights: { text: string }[] }[]
}

/** 
 * Hook for providing cover letter magic write functionality
 */
export const useMagicWrite = () => {
    const [writing, setWriting] = useState(false)

    const write = async (input: WriteProps): Promise<{ coverLetter: string }> => {
        try {
            setWriting(true)
            const response = await fetch('/api/cover-letter/generate-cover-letter', {
                method: 'POST',
                body: JSON.stringify(input),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const { coverLetter } = await response.json() as { coverLetter: string }
            return { coverLetter }
        } catch (error) {
            throw error
        } finally {
            setWriting(false)
        }
    }

    return { write, writing }
}