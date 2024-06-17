import { bufferToStream } from '@/utils/buffer';
import { createClient } from '@/utils/supabase/server';
import { parse } from 'csv-parse';
import { type Job } from 'lib/types';
import { ValidationError, number, object, string } from 'yup';

const jobSchema = object({
    position: string().required(),
    company_name: string().required(),
    description: string(),
    status: number(),
    link: string().required(),
    location: string(),
    priority: number()
})

export type JobImportColumns = Pick<Job, 'position' | 'company_name' | 'description' | 'status' | 'link' | 'location' | 'priority' | 'user_id'>

/**
 * Process the buffer and return the parsed CSV data
 */
function processBuffer(buffer: Buffer): Promise<JobImportColumns[]> {
    return new Promise((resolve, reject) => {
        const results: JobImportColumns[] = [];
        const readableStream = bufferToStream(buffer)

        const parser = parse({
            columns: true,
            skip_empty_lines: true
        });
        readableStream.pipe(parser);

        parser.on('data', (data) => {
            results.push(data);
        })

        parser.on('error', (err) => {
            reject(err)
        })
        parser.on('end', () => {
            resolve(results)
        })
    })
}

/**
 * ensure valid headers are present in csv
 * @param jobs 
 * @returns 
 */
function validateHeaders(jobs: JobImportColumns[]) {
    const headers = Object.keys(jobs[0] as JobImportColumns);
    const requiredHeaders = ['position', 'company_name', 'link', 'location'];
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header))
    return {
        isValid: missingHeaders.length === 0,
        missingHeaders
    }
}

/**
 *  validate the row items in the csv
 * @param jobs 
 * @param userId 
 * @returns 
 */
async function validateItems(jobs: JobImportColumns[], userId: string) {
    const validItems = [];
    const validationErrors = [];

    for (const job of jobs) {
        try {
            await jobSchema.validate(job, { abortEarly: false });
            validItems.push({
                position: job.position,
                company_name: job.company_name,
                description: job.description,
                status: job.status,
                link: job.link,
                location: job.location,
                priority: job.priority,
                user_id: userId
            })
        } catch (error) {
            if (error instanceof ValidationError) {
                validationErrors.push(error)
            }
        }
    }

    if (validationErrors.length > 0) {
        const errors = validationErrors.map(e => e.message)
        throw new Error(errors.join('\n'))
    }

    return { validItems }
}

export async function POST(request: Request) {
    const client = createClient()

    try {
        const { data: { user }, error } = await client.auth.getUser()
        if (!user || error) throw error;
        const csvBuffer = Buffer.from(await request.arrayBuffer());
        const csvData = await processBuffer(csvBuffer);
        if (csvData.length === 0) throw new Error('No data found in CSV')
        const { isValid, missingHeaders } = validateHeaders(csvData)
        if (!isValid) throw new Error(`Missing headers: ${missingHeaders.join(', ')}`)
        const { validItems } = await validateItems(csvData, user.id);
        return Response.json({ success: true, data: validItems })
    } catch (e) {
        if (e instanceof Error) {
            return Response.json({ success: false, error: e.message }, { status: 501 })
        }
    }
}