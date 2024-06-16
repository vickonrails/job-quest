import { createClient } from '@/utils/supabase/server';
import { parse } from 'csv-parse';
import { type Job } from 'lib/types';
import { Readable } from 'stream';

function bufferToStream(buffer: Buffer) {
    const readableStream = new Readable({
        read() {
            this.push(buffer);
            this.push(null);
        }
    });
    return readableStream;
}

export type JobImportColumns = Pick<Job, 'position' | 'company_name' | 'description' | 'status' | 'link' | 'location' | 'priority'>

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

export async function POST(request: Request) {
    const client = createClient()

    try {
        const { data, error } = await client.auth.getUser()
        if (!data || error) throw error;
        const csvBuffer = Buffer.from(await request.arrayBuffer());
        const csvData = await processBuffer(csvBuffer);
        const jobs = csvData.map((job) => {
            return {
                position: job.position,
                company_name: job.company_name,
                description: job.description,
                status: job.status,
                link: job.link,
                source: 'import-csv',
                priority: job.priority
            }
        })
        return Response.json({ data: jobs, success: true })
    } catch (e) {
        return Response.json({ success: false, error: e }, { status: 501 })
    }
}