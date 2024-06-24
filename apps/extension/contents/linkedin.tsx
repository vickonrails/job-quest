
import { useMessage } from '@plasmohq/messaging/hook';
import cssText from 'data-text:../styles/global.css';
import type { PlasmoCSConfig, PlasmoCSUIProps } from 'plasmo';
import { useState, type FC } from 'react';
import { cn } from 'shared';
import { type LinkedInButtonProps } from '~components/linkedin-button';
import { JobInfoSheet } from '~components/sheets/JobInfoSheet';
import { useJob } from '~hooks/useJob';
import type { Job, JobInsertDTO } from '~types';
import { getJobDetails, getJobUrl } from '~utils/get-job-content';

// also work on the motion of the extension popup
// body not scrolling when modal is open (only on linkedin)
// have to find some way to reload the entire extension if we encounter a page refresh
// add additional button for adding job description (Add job description). If there's no job description on the page, we can then show some info and prompt them to go back to enter job description
// customize the scrollbar so it can be consistent across browser and OS
// persist info to Job quest


// TODO: research how to only show the button after the page is fully loaded (check out the document.readyState property)

export const config: PlasmoCSConfig = {
    matches: ['https://www.linkedin.com/*']
}

const getDefaultJobData = (jobInfo: Partial<Job>): JobInsertDTO => {
    return {
        ...jobInfo,
        user_id: '',
        position: jobInfo.position ?? '',
        location: jobInfo.location ?? '',
        company_name: jobInfo.company_name ?? '',
        description: jobInfo.description ?? '',
        link: jobInfo.link ?? '',
        company_site: jobInfo.company_site ?? '',
        status: 0
    }
}

export function getStyle() {
    const style = document.createElement('style');
    style.textContent = cssText;
    return style;
}

export const isLinkedIn = window.location.href.includes('linkedin.com');

const AnchorTypePrinter: FC<PlasmoCSUIProps> = ({ anchor }) => {
    const url = getJobUrl()
    const [open, setOpen] = useState(false);
    const [jobURL, setJobURL] = useState(url)

    const close = () => {
        setOpen(false);
    }

    const handleURLChange = () => {
        setJobURL(getJobUrl())
    }

    const handleClick = () => {
        setOpen(true)
    }

    return (
        <section className={cn(isLinkedIn && 'linkedIn', 'page')}>
            {/* {isLinkedIn ?
                <LinkedInButton onClick={handleClick} /> :
                <CompanionBtn onClick={handleClick} isOpen={isOpen} />
            } */}
            <CompanionBtn onClick={handleClick} isOpen={open} />
            {open && (
                <JobInfoSheet
                    onURLChange={handleURLChange}
                    open={open}
                    url={jobURL}
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

export default AnchorTypePrinter