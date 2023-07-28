import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { type Database } from '../../lib/database.types.ts'
import jobs from './jobs.ts'
import { reportError } from './reportError.ts';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
dotenv.config();
/**
 * connect to supabase
 * @returns supabaseClient
 */
const connect = () => {
    return createClient<Database>(
        process.env.SUPABASE_URL as string,
        process.env.SUPABASE_ANON_KEY as string
    );
}

// TODO: modify seed value to put labels as array
// TODO: fix profile not created on sign up (I can't put that as a trigger on the DB anymore)
// TODO: Priority by default is mid or medium
// TODO: seed the rating column

const seedJobs = async (client: SupabaseClient<Database>) => {
    const promises = jobs.map(async job => {
        const { data, error } = await client.from('jobs').insert({ ...job });
        if (error) {
            throw new Error(`Failed to seed job ${job.position}`, { cause: error.message });
        }
        return data;
    });

    await Promise.all(promises).then(_ => {
        // console.log(`Seeded ${_.length} jobs`);
    }).catch(err => {
        throw err;
    });
}

const seed = () => {
    try {
        const client = connect();
        seedJobs(client)
            .then(res => res)
            .catch(err => {
                throw err;
            });

    } catch (err) {
        reportError(err);
    }
}

seed();