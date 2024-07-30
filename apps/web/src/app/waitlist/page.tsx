'use client'

import { ErrorHint } from '@/components/resume-builder/setup/components/error-hint'
import { useToast } from '@/components/toast/use-toast'
import { addUserToWaitList } from '@/db/api/actions/add-user-to-waitlist'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AuthCard } from 'ui/auth-card'
import { Button } from 'ui/button'
import { Checkbox } from 'ui/checkbox'
import { Input } from 'ui/input'
import { Label } from 'ui/label'
import { Select } from 'ui/select'

type User = {
    email: string,
    firstName: string
    followUp?: boolean
    mostInterestingPart: 'browser-extension' | 'job-tracker' | 'resume-builder' | 'cover-letter-generator'
}

export default function Waitlist() {
    const { register, reset, handleSubmit, control, formState: { isSubmitting, errors } } = useForm<User>({ defaultValues: { firstName: '', followUp: false, email: '' } })
    const [formError, setFormError] = useState('')
    const [addedToList, setAddedToList] = useState(false)
    const { toast } = useToast()

    const onSubmit = async (values: User) => {
        setFormError('')
        const { success, error } = await addUserToWaitList(values)
        if (!success && error) {
            setFormError(error)
            return;
        }

        reset()
        setAddedToList(true)
        toast({
            title: 'Added to wait list'
        })
    }

    return (
        <AuthCard >
            <div className="w-full max-w-sm mx-auto list">
                <form className="flex flex-col gap-3 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <h1 className="mb-3 text-3xl font-medium">Join the Waitlist!</h1>
                        <p className="text-base text-muted-foreground">Get an invite and help shape new features.</p>
                    </div>

                    <Input
                        autoFocus
                        label="Full name"
                        hint={errors.firstName && <ErrorHint>{errors.firstName.message}</ErrorHint>}
                        {...register('firstName', { required: 'What do we call you?' })}
                    />

                    <Input
                        type="email"
                        label="Email address"
                        hint={errors.email && <ErrorHint>{errors.email?.message}</ErrorHint>}
                        {...register('email', { required: 'Email address is required' })}
                    />

                    <Controller
                        control={control}
                        name="mostInterestingPart"
                        rules={{ required: 'What part interests you the most' }}
                        render={({ field }) => (
                            <Select
                                onValueChange={field.onChange}
                                value={field.value ?? undefined}
                                label="Most interesting part"
                                hint={errors.mostInterestingPart && <ErrorHint>{errors.mostInterestingPart?.message}</ErrorHint>}
                                options={[
                                    { label: 'Browser extension', value: 'browser-extension' },
                                    { label: 'Job Tracker', value: 'job-tracker' },
                                    { label: 'Resume Builder', value: 'resume-builder' },
                                    { label: 'Cover Letter Generator', value: 'cover-letter-generator' },
                                ]}
                            />
                        )}
                    />


                    <Controller
                        name="followUp"
                        control={control}
                        render={({ field: item }) => (
                            <div className="flex items-center gap-1">
                                <Checkbox
                                    id="followUp"
                                    checked={item.value ?? false}
                                    onCheckedChange={val => item.onChange(val)}
                                />
                                <Label htmlFor="followUp">Would you be open to a short chat?</Label>
                            </div>
                        )}
                    />

                    <ErrorHint>{formError}</ErrorHint>

                    <Button loading={isSubmitting} disabled={addedToList}>Join Waitlist</Button>
                </form>
            </div>
        </AuthCard>
    )
}
