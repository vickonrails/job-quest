import { sendToBackground } from "@plasmohq/messaging"
import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo"
import { useState, type FC } from "react"
import { JobInfoSheet } from "~components/sheets/JobInfoSheet"

import cssText from "data-text:./styles/global.css"
import uiCSS from 'data-text:ui/dist/styles.css'
import { useJob } from "~hooks/useJob"
import type { Job } from "~types"
import { getJobContent, getJobId } from "~utils"
import { LinkedInButton } from "~components/linkedin-button"

export const getInlineAnchor = () => {
    return document.querySelector(".job-view-layout .jobs-save-button")
}

export const config: PlasmoCSConfig = {
    matches: ["https://www.linkedin.com/*"],
}

export function getStyle() {
    const style = document.createElement('style');
    style.textContent = uiCSS + cssText;
    return style;
}

const AnchorTypePrinter: FC<PlasmoCSUIProps> = ({ anchor }) => {
    const [isOpen, setOpen] = useState(false)
    const [selectedJob, setSelectedJob] = useState<null | Job>()
    const { isLoading, job, refresh } = useJob(getJobId())

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
                body: { ...job, source: 'linkedin', source_id: getJobId(), status: 0 }
            })
            if (!success) throw new Error('Failed to add job');
            refresh(job)
        } catch (err) {
            alert(`An error occurred ${err.message}`);
        }
    }

    return (
        <div className="ml-2 plasmoContainer">
            <LinkedInButton
                onClick={handleAddClick}
                isLoading={isLoading}
                added={Boolean(job)}
            />
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
