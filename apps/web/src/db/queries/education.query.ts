import { type Client } from '@/queries'

export async function fetchEducationQuery(client: Client, options: { userId: string, resumeId?: string | null }) {
    const { userId, resumeId } = options
    let query = client.from('education').select().eq('user_id', userId).throwOnError()
    if (resumeId === null) {
        query = query.filter('resume_id', 'is', null)
    } else if (resumeId !== undefined) {
        query = query.filter('resume_id', 'eq', resumeId)
    }
    return (await query).data
}