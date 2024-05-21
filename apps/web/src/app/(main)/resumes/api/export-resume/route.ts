import { createClient } from '@/utils/supabase/server';
import { readFileSync } from 'fs';
import { type NextRequest } from 'next/server';
import path from 'path';

const apiServiceURL = process.env.PDF_EXPORT_API_SERVICE_URL

export async function POST(req: NextRequest) {
    const supabase = createClient()
    const { html } = await req.json() as { html: string }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return new Response('Not authenticated', { status: 401 })
    }

    const cssFilePath = path.join(process.cwd(), 'src/styles/resume-templates.css');
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

        const headers = {
            'Content-Type': 'application/pdf',
        };
        const data = await response.arrayBuffer();
        return new Response(Buffer.from(data), { headers })
    } catch (e) {
        if (e instanceof Error) {
            return new Response(e.message ?? 'Something went wrong', {
                status: 501
            })
        }
    }
}