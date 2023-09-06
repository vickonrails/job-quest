import type { PlasmoCSUIProps } from "plasmo"
import type { FC } from "react"

import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"

import cssText from "data-text:./styles/global.css"
import { useCallback, useState } from "react"
import { Sheet, SheetTrigger, type SheetProps } from "~components/sheets/sheet"
import { JobInfoSheet } from "~components/sheets/JobInfoSheet"

export const getInlineAnchor = () => {
    return document.querySelector(".job-view-layout .jobs-save-button")
}

export const config: PlasmoCSConfig = {
    matches: ["https://www.linkedin.com/jobs/*"],
}

export function getStyle() {
    const style = document.createElement('style');
    style.textContent = cssText;
    return style;
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
        // setSelectedJob(null)
    }

    const handleAddToQuest = async (job: Job) => {
        try {
            const jobDetails = getJobContent();
            const { success } = await sendToBackground({
                name: 'add-job',
                body: jobDetails
            })
            if (success) alert(`Added to Job Quest`);
        } catch (err) {
            alert(`An error occurred ${err.message}`);
        }
    }

    return (
        <div style={{ marginLeft: 8, fontSize: '1.6rem' }} className="okay">
            {/* TODO: some kind of script to check if the job is already added to job quest */}
            <button
                onClick={handleAddClick}
                className="text-2xl font-medium cursor-pointer rounded-full text-linkedIn px-5 py-[10px] shadow-btn-border hover:shadow-btn-hover hover:bg-linkedIn-hover"
            >
                Add to JobQuest
            </button>
            {selectedJob && (
                <JobInfoSheet
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
