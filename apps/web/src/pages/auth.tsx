import { type Session, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { type Database } from 'lib/database.types';
import { type GetServerSideProps } from 'next';
import React, { useEffect } from 'react'

const AuthPage = ({ session }: { session: Session }) => {
    useEffect(() => {
        if (session) {
            window.postMessage({ type: 'auth', session })
        }

        const timer = setTimeout(() => {
            window.close();
        }, 3000)

        return () => clearTimeout(timer)
    }, [session])

    return (
        <div>Authenticating...</div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            session
        }
    }
}

export default AuthPage