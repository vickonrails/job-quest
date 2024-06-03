'use client'

import { type ReactNode, createContext, useContext } from 'react';
import { useWaitListDialog } from './wait-list';
import { WaitListDialog } from '../waitlist-dialog';

export const LandingPageContext = createContext<Omit<ReturnType<typeof useWaitListDialog>, 'closeWaitListModal'>>({
    open: false,
    openWaitListModal: () => {/** */ }
});

export function useLandingPageContext() {
    return useContext(LandingPageContext)
}

export function LandingPageProvider({ children }: { children: ReactNode }) {
    const { open, openWaitListModal, closeWaitListModal } = useWaitListDialog()
    return (
        <LandingPageContext.Provider value={{ open, openWaitListModal }}>
            {children}
            <WaitListDialog
                open={open}
                onOpenChange={closeWaitListModal}
                title="Join the waitlist"
            />
        </LandingPageContext.Provider>
    )
}