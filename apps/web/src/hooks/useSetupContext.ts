import { type Session } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

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

export function useSetupContext() {

    return {
        ...useContext(SetupContext)
    }
}