import { type User } from '@supabase/supabase-js'
import { createContext, useContext } from 'react'

export interface SetupContext {
    step: number,
    next: () => void,
    prev: () => void,
    canMoveNext: boolean,
    setStep: (state: number) => void
    canMovePrev: boolean,
    user?: User
}

// TODO: use context
const setupContextDefault: SetupContext = {
    step: 1,
    next: () => {/** */ },
    prev: () => { /** */ },
    setStep: () => { /** */ },
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