import { Briefcase, MapPin } from 'lucide-react';
import type { UseFormRegister } from "react-hook-form";
import { Input } from 'ui';
import { isLinkedIn } from "~contents";
import type { JobInsertDTO } from "~types";

export function PopupHeader({ job, register }: { job: Partial<JobInsertDTO>, register: UseFormRegister<JobInsertDTO> }) {
    const alreadyAdded = job ? job.id : ''
    if (isLinkedIn) {
        const { img, position, company_name, location } = job ?? {}
        return (
            <header className='flex gap-2 items-center'>
                <img src={img} alt="Company Logo" style={{ height: 60, width: 60 }} />
                <section className='flex flex-col gap-1'>
                    {position && <h2 className="text-base font-semibold text-foreground mb-1 leading-8">{position}</h2>}
                    {company_name && (
                        <div className='flex items-center gap-1'>
                            <Briefcase className='text-muted-foreground' size={16} />
                            <p className="text-sm text-muted-foreground">{company_name}</p>
                        </div>
                    )}
                    {location && (
                        <div className='flex gap-2'>
                            <div className='flex items-center gap-1'>
                                <MapPin className='text-muted-foreground' size={16} />
                                <p className="text-sm text-muted-foreground">{location}</p>
                            </div>
                            {alreadyAdded && (
                                <div className='select-none bg-green-100 text-xs text-green-800 rounded-full p-2 py-1'>Added</div>
                            )}
                        </div>
                    )}
                </section>
            </header>
        )
    }

    return (
        <>
            <Input
                autoFocus
                label="Job Title"
                className='text-accent-foreground bg-inherit'
                {...register('position')}
            />
            <Input
                label="Company name"
                {...register('company_name')}
            />
            <Input
                label="Location"
                {...register('location')}
            />
        </>
    )
}