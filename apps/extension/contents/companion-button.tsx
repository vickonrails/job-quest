import type { PlasmoCSConfig, PlasmoCSUIProps } from "plasmo";
import { useState, type FC } from "react";
import cssText from "data-text:../styles/global.css"
import uiCSS from 'data-text:ui/dist/styles.css'
import { JobInfoSheet } from "~components/sheets/JobInfoSheet"
import { LinkedInButton } from "~components/linkedin-button";

export const config: PlasmoCSConfig = {
    matches: ["https://www.linkedin.com/jobs/*"],
}

export const getInlineAnchor = () => {
    return document.querySelector(".job-view-layout .jobs-save-button")
}

export function getStyle() {
    const style = document.createElement('style');
    style.textContent = uiCSS + cssText;
    return style;
}

const AnchorTypePrinter: FC<PlasmoCSUIProps> = ({ anchor }) => {
    const [open, setOpen] = useState(false)

    const handleTriggerClick = () => {
        setOpen(true);
    }

    return (
        <section className="page shadowContainer">
            <LinkedInButton
                onClick={handleTriggerClick}
            />
            {open && (
                <JobInfoSheet
                    open={open}
                    onOpenChange={setOpen}
                    onSubmit={() => {/** */ }}
                />
            )}
        </section>
    )
}

export default AnchorTypePrinter