import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { Button } from 'ui/button'
import { useLandingPageContext } from './landing-page-context'

export function useWaitListDialog() {
    const [open, setOpen] = useState(false)
    const [isOnWaitList, setIsOnWaitList] = useState(false)
    const openWaitListModal = useCallback(() => setOpen(true), [])
    const closeWaitListModal = useCallback(() => setOpen(false), [])
    const setUserAddedToWaitList = useCallback(() => setIsOnWaitList(true), [])
    return {
        open,
        openWaitListModal,
        closeWaitListModal,
        isOnWaitList,
        setUserAddedToWaitList
    }
}

export function WaitList() {
    const { openWaitListModal, isOnWaitList } = useLandingPageContext()
    return (
        <section className="text-left md:text-center md:mx-auto pt-20 pb-28 max-w-5xl md:max-w-3xl">
            <section className="mb-6">
                <p className="uppercase mb-4 text-sm tracking-widest text-muted-foreground">JobQuest is launching very soon.</p>
                <h2 className="text-3xl md:text-6xl mb-4 font-bold leading-none from-accent-foreground to-muted-foreground bg-gradient-to-br text-transparent bg-clip-text">be first to know<br /> when it launches.</h2>
            </section>

            <section className="flex gap-3 md:justify-center flex-row items-center text-sm">
                <Link href="https://demo.getjobquest.com" target="_blank" className="transition text-accent-foreground/75 hover:text-secondary-foreground hover:underline flex gap-1 items-center order-2">
                    <span>See Demo</span>
                    <ExternalLink size={20} />
                </Link>
                <Button disabled={isOnWaitList} className="order-1" onClick={openWaitListModal}>Early Access</Button>
            </section>
        </section>
    )
}