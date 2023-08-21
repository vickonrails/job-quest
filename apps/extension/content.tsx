import type { PlasmoCSUIProps } from "plasmo"
import type { FC } from "react"

import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"

export const getInlineAnchor = () => {
    return document.querySelector(".jobs-save-button")
}

export const config: PlasmoCSConfig = {
    matches: ["https://www.linkedin.com/jobs/*"]
}

function getJobInfo() {
    // container class 
    // .jobs-unified-top-card__content--two-pane
    // title is the first child of the container
    // Company & Location is the second child of the container
    // the button is the third or last child of the container

    const infoContainerClass = 'jobs-unified-top-card__content--two-pane'
    const infoContainer = document.querySelector(`.${infoContainerClass}`);
    const infoChildren = Array.from(infoContainer.querySelectorAll('& > div'));
    const position = infoContainer.querySelector('h2');
    const company = document.querySelector('.jobs-unified-top-card__primary-description a')
    const jobLink = position.parentElement as HTMLAnchorElement;
    const description = document.querySelector('.jobs-box__html-content').innerHTML

    return {
        position: position.textContent.trim(),
        link: jobLink.href.split('?')[0],
        company_name: company.textContent.trim(),
        description
    }
}

const AnchorTypePrinter: FC<PlasmoCSUIProps> = ({ anchor }) => {
    const handleAddToQuest = () => {
        const jobDetails = getJobInfo();
        sendToBackground({
            name: 'add-job',
            body: jobDetails
        })
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
                Add to Job Quest
            </button>
        </div>
    )
}

export default AnchorTypePrinter
