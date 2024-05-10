import { Layout } from '@components/layout'
import { createClient } from '@lib/supabase/server-prop'
import { type Profile } from 'lib/types'
import { type GetServerSideProps } from 'next'
import { useNotes } from 'src/hooks/useNotes'
import { FullPageSpinner } from 'ui'

const Notes = ({ profile }: { profile: Profile }) => {
    const { data, isLoading } = useNotes({})
    if (isLoading) return <FullPageSpinner />

    return (
        <Layout
            className="flex"
            containerClasses="flex flex-col gap-4"
            profile={profile}
        >
            {data?.map(note => (<p key={note.id}>{note.text}</p>))}
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const supabase = createClient(context);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return {
            redirect: {
                destination: '/auth',
                permanent: false
            }
        }
    }

    const { data: profile } = await supabase.from('profiles').select().eq('id', user.id).single()

    return {
        props: {
            profile
        }
    }
}


export default Notes