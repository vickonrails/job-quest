import { type Resume } from '@lib/types';
import { useFormContext, useWatch } from 'react-hook-form';
import { type FormValues } from 'src/pages/resumes/[resume]';

export function Preview() {
    const { control } = useFormContext<FormValues>();
    const resume = useWatch<FormValues>({ control: control, name: 'resume' }) as Resume;
    return (
        <section className="bg-gray-100 flex-1 p-6 overflow-auto">
            <div className="bg-white p-6">
                <section className="text-sm">
                    <p><span className="font-bold">Full name</span>: {resume.full_name}</p>
                    <p><span className="font-bold">Email Address</span>: {resume.email_address}</p>
                    <p><span className="font-bold">Title</span>: {resume.title}</p>
                    <p><span className="font-bold">Summary</span>: {resume.professional_summary}</p>
                    <p><span className="font-bold">Location</span>: {resume.location}</p>
                </section>
            </div>
        </section>
    )
}