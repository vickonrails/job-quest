import Image from 'next/image'
import { useCallback, useState } from 'react'
import { Button } from 'ui/button'
import { useLandingPageContext } from './landing-page-context'

export function useWaitListDialog() {
    const [open, setOpen] = useState(false)
    const openWaitListModal = useCallback(() => setOpen(true), [])
    const closeWaitListModal = useCallback(() => setOpen(false), [])
    return { open, openWaitListModal, closeWaitListModal }
}

export function WaitList() {
    const { openWaitListModal } = useLandingPageContext()
    return (
        <section className="text-center pt-40 pb-28 max-w-lg">
            <section className="mb-6">
                <Image className="animate-pulse rounded-sm mx-auto mb-6" src="/logo.png" width={80} height={80} alt="" />
                <p className="uppercase text-sm tracking-widest text-muted-foreground">What&apos;s stopping you?</p>
                <h2 className="text-6xl max-w-5xl font-medium leading-tight ">join the waitlist.</h2>
                <p className="text-base text-muted-foreground ">jobquest includes a Job Tracker, a Resume builder, a browser clipper for grabbing jobs anywhere on the internet, and an AI assistant to help with cover letters, etc. We&apos;re close to a beta release and by joining now, you&apos;ll unlock some features and get immediate support.</p>
            </section>
            <Button onClick={openWaitListModal} className="font-medium">Get Early Access</Button>
        </section>
    )
}