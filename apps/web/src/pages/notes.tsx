import React from 'react'
import { Layout } from '@components/layout'
import { FullPageSpinner } from '@components/spinner'
import { type Session, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { type Database } from 'lib/database.types'
import { type Profile } from 'lib/types'
import { type GetServerSideProps } from 'next'
import { useNotes } from 'src/hooks/useNotes'

const Notes = ({ session, profile }: { session: Session, profile: Profile }) => {
    const { data, isLoading } = useNotes({})
    if (isLoading) return <FullPageSpinner />

    return (
        <Layout
            className="flex"
            containerClasses="flex flex-col gap-4"
            session={session}
            profile={profile}
        >
            {data?.map(note => (<p key={note.id}>{note.text}</p>))}
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createServerSupabaseClient<Database>(context);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        return {
            redirect: {
                destination: '/sign-in',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', session?.user.id).single()

    return {
        props: {
            session,
            profile
        }
    }
}


export default Notes