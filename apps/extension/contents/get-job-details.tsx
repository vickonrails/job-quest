import type { PlasmoCSUIProps } from "plasmo"
import type { FC } from "react"

import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"

export const getInlineAnchor = () => {
    return document.querySelector(".job-view-layout .jobs-save-button")
}

export const config: PlasmoCSConfig = {
    matches: ["https://www.linkedin.com/jobs/*"]
}

function getJobContent() {
    const isFullPage = window.location.href.includes('jobs/view');
    const container = document.querySelector('.jobs-unified-top-card');
    const position = container.querySelector(`${isFullPage ? 'h1' : 'h2'}`).textContent.trim()
    const locationContainer = container.querySelector('.jobs-unified-top-card__primary-description > div');
    const location = locationContainer.childNodes[3].textContent.trim();
    const company_name = locationContainer.querySelector('a').textContent.trim();
    const link = window.location.href.split('?')[0];
    const description = document.querySelector('.jobs-box__html-content').innerHTML

    return {
        container,
        position,
        company_name,
        location,
        link,
        description
    }
}

const AnchorTypePrinter: FC<PlasmoCSUIProps> = ({ anchor }) => {
    const handleAddToQuest = async () => {
        try {
            const jobDetails = getJobContent();
            const { success } = await sendToBackground({
                name: 'add-job',
                body: jobDetails
            })
            if (success) alert(`Added to Job Quest`);
        } catch (err) {
            alert(`An error occurred ${err.message}`)
        }
    }

    return (
        <div onClick={handleAddToQuest} style={{ marginLeft: 12 }}>
            {/* TODO: some kind of script to check if the job is already added to job quest */}
            <button style={{
                border: '1px solid #0a66c2',
                borderRadius: 38,
                fontSize: 16,
                padding: '8px 16px',
                height: '100%',
                fontWeight: 'medium',
                background: 'inherit',
                color: '#0a66c2',
                cursor: 'pointer'
            }}>
                {/* TODO: just use the JQ logo here */}
                Add to Job
            </button>
        </div>
    )
}

export default AnchorTypePrinter
