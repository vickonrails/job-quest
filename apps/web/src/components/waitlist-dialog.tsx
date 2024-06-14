import { addUserToWaitList } from '@/actions/user/add-user-to-waitlist'
import { Title } from '@radix-ui/react-dialog'
import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from 'ui/dialog'
import { Input } from 'ui/input'
import { useLandingPageContext } from './landing-page/landing-page-context'
import { ErrorHint } from './resume-builder/setup/components/error-hint'
import { useToast } from './toast/use-toast'

type DeleteDialogProps = React.ComponentProps<typeof Dialog> & {
    title: string | ReactNode
}

type User = {
    email: string,
    firstName: string
}

export function WaitListDialog({ open, title, ...rest }: DeleteDialogProps) {
    const { register, reset, handleSubmit, formState: { isSubmitting, isSubmitSuccessful, errors } } = useForm<User>({ defaultValues: { firstName: '', email: '' } })
    const [formError, setFormError] = useState('')
    const { closeWaitListModal, setUserAddedToWaitList } = useLandingPageContext()
    const { toast } = useToast()

    useEffect(() => {
        return () => setFormError('')
    }, [open])

    const onSubmit = async (values: User) => {
        setFormError('')
        const { success, error } = await addUserToWaitList(values)
        if (!success && error) {
            setFormError(error)
            return;
        }

        reset()
        setUserAddedToWaitList()
        closeWaitListModal()
        toast({
            title: 'Added to wait list'
        })
    }

    return (
        <Dialog open={open} {...rest}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <Title>{title}</Title>
                </DialogHeader>
                <DialogDescription>
                    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                        <Input
                            label="First name"
                            {...register('firstName', {
                                required: { message: 'First name is required', value: true }
                            })}
                            hint={<ErrorHint>{errors.firstName?.message}</ErrorHint>}
                        />

                        <Input
                            placeholder="Jane@gmail.com"
                            label="Email address"
                            {...register('email', {
                                required: { message: 'Email address is required', value: true }
                            })}
                            hint={<ErrorHint>{errors.email?.message}</ErrorHint>}
                        />
                        <ErrorHint>{formError}</ErrorHint>
                        <Button disabled={isSubmitSuccessful} loading={isSubmitting}>Join</Button>
                    </form>
                </DialogDescription>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
