
import cssText from 'data-text:../styles/global.css';
import type { PlasmoCSConfig, PlasmoCSUIProps } from 'plasmo';
import { useState, type FC } from 'react';
import { type LinkedInButtonProps } from '~components/linkedin-button';
import { JobInfoSheet } from '~components/sheets/JobInfoSheet';
import { getJobUrl } from '~utils/get-job-content';

// TODO: research how to only show the button after the page is fully loaded (check out the document.readyState property)

export const config: PlasmoCSConfig = {
    matches: ['https://ng.indeed.com/*']
}

export function getStyle() {
    const style = document.createElement('style');
    style.textContent = cssText;
    return style;
}

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
        <section className="page">
            <CompanionBtn onClick={handleClick} isOpen={open} />
            {open && (
                <JobInfoSheet
                    onURLChange={handleURLChange}
                    url={jobURL}
                    open={open}
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