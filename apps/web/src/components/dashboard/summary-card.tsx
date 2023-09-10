import { type HTMLAttributes } from 'react';

interface SummaryCardProps extends HTMLAttributes<HTMLElement> {
    title: string;
    description?: string
}

export function SummaryCard({ title, description, ...rest }: SummaryCardProps) {
    return (
        <article className="bg-white w-full rounded-lg p-4 relative overflow-hidden border" {...rest}>
            <h2 className="text-2xl mb-2 font-medium">{title}</h2>
            <p className="text-gray-500">{description}</p>
            <Artefact />
        </article>
    )
}

function Artefact() {
    return (
        <div className="absolute top-1/3 right-0">
            <span className="absolute border-[20px] rounded-full border-primary/5 h-20 w-20 block right-5 top-4" />
            <span className="absolute rounded-full bg-primary/10 h-5 w-5 block right-12 top-12" />
        </div>
    )
}