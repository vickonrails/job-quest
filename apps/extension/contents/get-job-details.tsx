import type { PlasmoCSUIProps } from "plasmo"
import type { FC } from "react"
import { sendToBackground } from "@plasmohq/messaging"
import type { PlasmoCSConfig } from "plasmo"
import { useState } from "react"
import { JobInfoSheet } from "~components/sheets/JobInfoSheet"

import cssText from "data-text:./styles/global.css"
import uiCSS from 'data-text:ui/dist/styles.css'

export const getInlineAnchor = () => {
    return document.querySelector(".job-view-layout .jobs-save-button")
}

export const config: PlasmoCSConfig = {
    matches: ["https://www.linkedin.com/jobs/*"],
}

export function getStyle() {
    const style = document.createElement('style');
    style.textContent = uiCSS + cssText;
    return style;
}

/**
 * fetch the ID of the job from the URL
 */
function getJobId() {
    const strPattern = /\b\d{10}\b/g;
    const url = window.location.href;
    return url.match(strPattern)[0];
}

function getJobContent(): Job {
    const isFullPage = window.location.href.includes('jobs/view');
    const container = document.querySelector('.jobs-unified-top-card');
    const position = container.querySelector(`${isFullPage ? 'h1' : 'h2'}`).textContent.trim()
    const locationContainer = container.querySelector('.jobs-unified-top-card__primary-description > div');
    const location = locationContainer.childNodes[3].textContent.trim();
    const company_name = locationContainer.querySelector('a').textContent.trim();
    const link = window.location.href.split('?')[0];
    const description = document.querySelector('.jobs-box__html-content').innerHTML
    const jobId = getJobId();

    return {
        id: '',
        position,
        company_name,
        location,
        link,
        description
    }
}

export interface Job {
    id: string
    position: string
    company_name: string
    company_site?: string
    location: string
    link: string
    description: string
    priority?: number
    status?: number
}

const AnchorTypePrinter: FC<PlasmoCSUIProps> = ({ anchor }) => {
    const [isOpen, setOpen] = useState(false)
    const [selectedJob, setSelectedJob] = useState<null | Job>()

    const handleAddClick = () => {
        const jobDetails = getJobContent();
        setOpen(true)
        setSelectedJob(jobDetails)
    }

    const closeSheet = () => {
        setOpen(false)
        setSelectedJob(null)
    }

    const handleAddToQuest = async (job: Job) => {
        try {
            const { success } = await sendToBackground({
                name: 'add-job',
                body: job
            })
            // TODO: add toast here
            if (success) alert(`Added to Job Quest`);
        } catch (err) {
            alert(`An error occurred ${err.message}`);
        }
    }

    // TODO: 
    // use the jobId to query the db for the job
    // if it exists then show that it's added to job quest already
    // else show the JB button

    return (
        <div className="ml-2 plasmoContainer">
            <button
                onClick={handleAddClick}
                className="text-base font-medium cursor-pointer rounded-full border-linkedIn text-linkedIn px-5 py-[10px] shadow-outline hover:shadow-outline-hover hover:bg-linkedIn-hover"
            >
                JB
            </button>
            {selectedJob && (
                <JobInfoSheet
                    title="Add Job"
                    entity={selectedJob}
                    open={isOpen}
                    onOpenChange={closeSheet}
                    onSubmit={handleAddToQuest}
                />
            )}
        </div>
    )
}



export default AnchorTypePrinter
