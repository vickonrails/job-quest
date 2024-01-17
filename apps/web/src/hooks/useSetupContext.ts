import { type Database } from '@lib/database.types'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { type Session } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'
import { type FormFields } from 'src/pages/profile/setup'

interface SetupContext {
    step: number,
    next: () => void,
    prev: () => void,
    canMoveNext: boolean,
    canMovePrev: boolean,
    session?: Session
}

// TODO: use context
const setupContextDefault: SetupContext = {
    step: 1,
    next: () => {/** */ },
    prev: () => { /** */ },
    canMoveNext: false,
    canMovePrev: false
}

const SetupContext = createContext(setupContextDefault)
export const SetupProvider = SetupContext.Provider

type BasicInfo = Pick<FormFields, 'full_name' | 'professional_summary' | 'title' | 'location'>

// TODO: am I getting a new useSetupContext instance when I call this hook?
export function useSetupContext() {
    const client = useSupabaseClient<Database>()
    const updateBasicInfo = async (values: BasicInfo, userId: string) => {
        const { data, error } = await client.from('profiles').update(values).eq('id', userId);

        if (error) {
            console.error(error)
            return
        }

        console.log(data)
    }

    // TODO: delete previously saved work experience
    const updateWorkExperience = async (values: FormFields, userId: string) => {
        const { workExperience } = values

        const promise = workExperience?.map((value) => {
            const exists = Boolean(value.id);
            return exists ?
                client.from('work_experience').update({ ...value, user_id: userId }).eq('id', userId) :
                client.from('work_experience').insert({ ...value, user_id: userId }).eq('id', userId)
        })

        if (!promise) return;

        // TODO: error handling
        await Promise.all(promise);
    }

    const deleteExperience = async (id: string) => {
        const { data, error } = await client.from('work_experience').delete().eq('id', id);

        if (error) {
            console.error(error)
            return
        }

        console.log(data)
    }

    return {
        ...useContext(SetupContext),
        updateBasicInfo,
        updateWorkExperience,
        deleteExperience
    }
}