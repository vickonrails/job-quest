'use client'

import { type ReactNode, createContext, useContext } from 'react';
import { useWaitListDialog } from './wait-list';
import { WaitListDialog } from '../waitlist-dialog';

export const LandingPageContext = createContext<ReturnType<typeof useWaitListDialog>>({
    open: false,
    openWaitListModal: () => {/** */ },
    closeWaitListModal: () => {/** */ },
    isOnWaitList: false,
    setUserAddedToWaitList: () => {/** */ }
});

export function useLandingPageContext() {
    return useContext(LandingPageContext)
}

export function LandingPageProvider({ children }: { children: ReactNode }) {
    const { open, openWaitListModal, closeWaitListModal, isOnWaitList, setUserAddedToWaitList } = useWaitListDialog()
    return (
        <LandingPageContext.Provider value={{ open, openWaitListModal, closeWaitListModal, isOnWaitList, setUserAddedToWaitList }}>
            {children}
            <WaitListDialog
                open={open}
                onOpenChange={closeWaitListModal}
                title="Join the waitlist"
            />
        </LandingPageContext.Provider>
    )
}