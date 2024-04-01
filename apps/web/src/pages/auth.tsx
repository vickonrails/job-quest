import { createPagesServerClient, type Session } from '@supabase/auth-helpers-nextjs';
import { type GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { type Database } from 'shared';

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
    const supabase = createPagesServerClient<Database>(context);
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