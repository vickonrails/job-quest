import { type Session, useSupabaseClient } from "@supabase/auth-helpers-react";
import { type Database } from "lib/database.types";
import { useEffect, useState } from "react";

type Profile = Database['public']['Tables']['profiles']['Row'];

// I might need to rename this to useAuth and incorperate local storage to store the session or atleast the email address
export const useUser = (session: Session | null) => {
    const [profile, setProfile] = useState<Profile>();
    const [loading, setLoading] = useState(true);
    const client = useSupabaseClient<Database>();

    useEffect(() => {
        const setUser = async (id: string) => {
            const { data, error } = await client.from('profiles').select().eq('id', id);
            if (error) {
                throw new Error(error.message);
            }
            if (data) {
                // @ts-ignore
                setProfile({ ...data[0] });
            }
        }
        if (session) {
            setUser(session?.user.id).then(_ => {
                setLoading(false);
            }).catch(err => {
                setLoading(false);
            });
        }
    }, [session, client]);

    return [profile, loading];
}
