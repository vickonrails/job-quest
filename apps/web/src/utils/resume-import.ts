import { type ZodIssue, z } from 'zod';
import { resumeSchema } from './resume-schema';

export type ProfileSetupType = z.infer<typeof resumeSchema>;

export async function extractResumeData(file: ArrayBuffer, filename: string, onMessage: (text: ProfileSetupType) => void, onStreamEnd: () => void) {
    const formData = new FormData();
    formData.append('file', new Blob([file]), filename);
    formData.append('filename', filename);
    const response = await fetch('resume-upload/api', {
        method: 'POST',
        body: formData
    })

    if (!response.ok) return;

    const reader = response.body?.getReader()
    const decoder = new TextDecoder();
    if (!reader) return

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true })
        const objects = chunk.split('\n').filter(Boolean).map(x => JSON.parse(x))[0];
        onMessage(objects)
    }

    onStreamEnd();
}

export function validateProfile(object: ProfileSetupType) {
    let validationErrors: ZodIssue[] = []
    let value

    try {
        value = resumeSchema.parse(object)
    } catch (error) {
        if (error instanceof z.ZodError) {
            validationErrors = error.errors
        } else {
            // TODO: handle errors properly
            // console.error('An unexpected error occurred:', error);
        }
    }

    return { value, validationErrors }
}