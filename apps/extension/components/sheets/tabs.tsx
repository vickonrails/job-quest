import * as RadixTabs from '@radix-ui/react-tabs';
import { Briefcase, MapPin } from 'lucide-react';
import { Controller, type UseFormRegister, type UseFormReturn } from 'react-hook-form';
import { Button, Input, Rating, Spinner, Textarea } from 'ui';
import Tiptap from '~components/tiptap';
import { isLinkedIn } from '~contents';
import type { Job } from '~types';
import { cn } from '~utils';

type Form = UseFormReturn<Job>
type JobInfoTabsProps = {
    form: Form,
    job: Job,
    fetchingJob: boolean
}

function Trigger({ className, active, ...props }: RadixTabs.TabsTriggerProps & { active?: boolean }) {
    return (
        <RadixTabs.Trigger
            className={cn('uppercase text-sm select-none pb-2 text-muted-foreground border-b-2 border-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary', className)}
            {...props}
        />
    )
}

export function JobInfoTabs({ form, job, fetchingJob }: JobInfoTabsProps) {
    const { formState: { isSubmitting } } = form
    const alreadyAdded = job ? job.id : ''
    return (
        <RadixTabs.Root defaultValue='info'>
            <RadixTabs.List className='flex flex-row gap-3 border-b mb-4'>
                <Trigger value='info'>Info</Trigger>
                <Trigger value='description'>Description</Trigger>
            </RadixTabs.List>
            {fetchingJob ? <SpinnerContainer /> : (
                <>
                    <RadixTabs.Content value='info'>
                        <BasicInfo form={form} job={job} />
                    </RadixTabs.Content>
                    <RadixTabs.Content value='description'>
                        <JobDescription form={form} />
                    </RadixTabs.Content>

                    <div className='pt-4'>
                        <Button className='p-3 block w-full mb-2' loading={isSubmitting}>
                            {alreadyAdded ? 'Update Job' : 'Add Job'}
                        </Button>

                        {job && <a className='text-center text-sm text-primary underline block' target='_blank' rel="noreferrer noopener" href={`http://127.0.0.1:3000/jobs/${job.id}`}>See in Job Quest</a>}
                    </div>
                </>
            )}
        </RadixTabs.Root>
    )
};

function BasicInfo({ form, job }: { form: Form, job: Job }) {
    const { control, register } = form
    return (
        <>
            <div className='tiptap hidden'></div>
            <input type='hidden' {...register('id')} />
            <div className="flex flex-col gap-4">
                <div className='m-1.5 hidden' />
                <PopupHeader job={job} register={register} />
                <section className='flex flex-col gap-4'>
                    <div>
                        <div className="m-1.5 select-none text-muted-foreground text-sm">Rating</div>
                        <Controller
                            name='priority'
                            control={control}
                            render={({ field }) => (
                                <Rating
                                    value={field.value}
                                    onClick={(val) => { field.onChange(val) }}
                                    size='md'
                                />
                            )}
                        />
                    </div>

                    <Textarea
                        className='py-2'
                        label='Notes' {...register('notes')}
                        autoFocus={isLinkedIn || false}
                    />

                </section>
            </div>
        </>
    )
}

function JobDescription({ form }: { form: Form }) {
    const { control } = form
    return (
        <div>
            <div className='select-none text-sm mb-2 text-muted-foreground'>Description</div>
            <Controller
                name='description'
                control={control}
                render={({ field }) => (
                    <Tiptap
                        content={field.value}
                        onChange={val => field.onChange(val)}
                    />
                )}
            />
        </div>
    )
}

// TODO: just pass the whole form
function PopupHeader({ job, register }: { job: Partial<Job>, register: UseFormRegister<Job> }) {
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

function SpinnerContainer() {
    return (
        <div className='flex justify-center mt-6'>
            <Spinner />
        </div>
    )
}