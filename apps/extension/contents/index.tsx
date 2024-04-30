import { sendToBackground } from '@plasmohq/messaging';
import { useStorage } from '@plasmohq/storage/hook';
import type { Session } from '@supabase/supabase-js';
import cssText from 'data-text:../styles/global.css';
import type { PlasmoCSUIProps } from 'plasmo';
import { useEffect, useState, type FC } from 'react';
import { cn } from 'shared';
import { Spinner } from 'ui';
import { LinkedInButton, type LinkedInButtonProps } from '~components/linkedin-button';
import { JobInfoSheet } from '~components/sheets/JobInfoSheet';
import { supabase as client } from '~core/supabase';
import { getJobDetails } from '~utils/get-job-content';

// also work on the motion of the extension popup
// body not scrolling when modal is open (only on linkedin)
// have to find some way to reload the entire extension if we encounter a page refresh
// add additional button for adding job description (Add job description). If there's no job description on the page, we can then show some info and prompt them to go back to enter job description
// customize the scrollbar so it can be consistent across browser and OS
// persist info to Job quest

// TODO: research how to only show the button after the page is fully loaded (check out the document.readyState property)

export const getInlineAnchor = () => {
    if (isLinkedIn) {
        return document.querySelector('.job-details-jobs-unified-top-card__container--two-pane .jobs-save-button')
    }
    return document.body;
}

export function getStyle() {
    const style = document.createElement('style');
    style.textContent = cssText;
    return style;
}

export const isLinkedIn = window.location.href.includes('linkedin.com');

const AnchorTypePrinter: FC<PlasmoCSUIProps> = ({ anchor }) => {
    const [jobInfo, setJobInfo] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false)
    const close = () => {
        setJobInfo(null);
    }

    useEffect(() => {
        async function init() {
            // const { data, error } = await client.auth.getSession();
            // console.log({ data, error })
            // first check if there's 
        }

        init().then(() => {
            // 
        }).catch(() => {
            // 
        })
    }, [])

    useEffect(() => {
        client.auth.onAuthStateChange((user) => {
            //   setIsLoading(false)
            //   setUser(user)
        })
    }, [])

    const handleClick = () => {
        setJobInfo(getJobDetails());
    }

    if (loadingUser) return <p>Loading...</p>
    const isOpen = Boolean(jobInfo)

    return (
        <section className={cn(isLinkedIn && 'linkedIn', 'page')}>
            {isLinkedIn ?
                <LinkedInButton onClick={handleClick} /> :
                <CompanionBtn onClick={handleClick} isOpen={isOpen} />
            }
            {isOpen && (
                <JobInfoSheet
                    title="Job Info"
                    open={Boolean(jobInfo)}
                    jobInfo={jobInfo}
                    onSubmit={() => {/** */ }}
                    onOpenChange={close}
                />
            )}
        </section>
    )
}

function CompanionBtn({ isOpen, ...props }: LinkedInButtonProps & { isOpen?: boolean }) {
    if (isOpen) return;

    return (
        <button
            onClick={props.onClick}
            className="h-14 w-14 p-2 flex flex-row fixed bottom-52 transition-transform right-0 translate-x-8  hover:translate-x-0 text-white font-medium" {...props}
        >
            <div className="bg-primary m-auto rounded-l-md h-full select-none flex-1 flex">
                <span className="m-auto">JQ</span>
            </div>
        </button>
    )
}

function useAuth() {
    const [session] = useStorage<Session>('session')
    const [firstRender, setFirstRender] = useState(true)

    // This useEffect is a hack to solve the bug in useStorage that makes the first render value undefined.
    useEffect(() => {
        const timer = setTimeout(() => {
            setFirstRender(false);
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, []);

    useEffect(() => {
        if (firstRender) return;

        if (!session) {
            navigateToAuth()
        }

    }, [firstRender, session])

    return { session, loading: firstRender }
}

type AuthGuardProps = React.HTMLAttributes<HTMLDivElement>

function navigateToAuth() {
    sendToBackground({
        name: 'auth',
        body: {
            action: 'navigate-to-auth'
        }
    }).then(() => {
        // 
    }).catch(() => {
        // 
    })
}

export function AuthGuard({ children: Cmp }: AuthGuardProps) {
    const { session, loading } = useAuth();

    if (loading) {
        return <Spinner variant="primary" className="m-auto mt-4" />
    }

    if (!session) {
        return (
            <p>You are not authenticated</p>
        )
    }

    return (
        <section>{Cmp}</section>
    )
}

export default AnchorTypePrinter