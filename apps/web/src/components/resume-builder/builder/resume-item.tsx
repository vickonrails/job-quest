import { type Resume } from '@lib/types'
import React from 'react'

export default function ResumeItem({ resume }: { resume: Resume }) {
    return (
        <div className="grid h-24 w-24 p-2 border cursor-pointer select-none hover:border-neutral-300 text-sm text-center text-muted-foreground hover:text-inherit">
            <p className="m-auto">
                {resume.title}
            </p>
        </div>
    )
}
