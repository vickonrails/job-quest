import { type Profile } from '@lib/types';
import { useFormContext, useWatch } from 'react-hook-form';
import { type FormValues } from 'src/pages/resumes/builder';

export function Preview() {
    const { control } = useFormContext<FormValues>();
    const profile = useWatch<FormValues>({ control: control, name: 'profile' }) as Profile;
    return (
        <div className="bg-white p-6">
            <section className="text-sm">
                <p><span className="font-bold">Full name</span>: {profile.full_name}</p>
                <p><span className="font-bold">Email Address</span>: {profile.email_address}</p>
                <p><span className="font-bold">Title</span>: {profile.title}</p>
                <p><span className="font-bold">Summary</span>: {profile.professional_summary}</p>
                <p><span className="font-bold">Location</span>: {profile.location}</p>
            </section>
        </div>
    )
}