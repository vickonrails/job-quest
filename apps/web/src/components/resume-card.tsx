import { type Resume } from '@lib/types';
import { cn } from '@utils/cn';
import { GanttChartSquare } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from './utils';

/** 
 * Component for rendering a preview card for a resume
 */

export function ResumePreviewCard({ resume, className }: { resume: Resume, className: string }) {
    return (
        <Link href={`/resumes/${resume.id}`} className={cn('w-[32%] border rounded-md p-4 group hover:border-primary', className)}>
            <article className="bg-white rounded-lg flex gap-2 items-center">
                <div className={cn('transition-colors text-white h-24 p-2 w-1/3 text-3xl bg-neutral-300 font-bold grid')} >
                    <GanttChartSquare size={40} className="transition-transform m-auto group-hover:scale-125" />
                </div>
                <div>
                    <h3 className="transition-transform font-medium leading-tight mb-1 group-hover:translate-y-0.5 group-hover:text-primary">{resume.title}</h3>
                    {resume.created_at && <p className="transition-transform text-muted-foreground text-sm group-hover:-translate-y-0.5">{formatDate(resume.created_at)}</p>}
                </div>
            </article>
        </Link >
    )
}