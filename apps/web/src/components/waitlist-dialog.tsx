import { Title } from '@radix-ui/react-dialog'
import { type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from 'ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from 'ui/dialog'
import { Input } from 'ui/input'
import { ErrorHint } from './resume-builder/setup/components/error-hint'

type DeleteDialogProps = React.ComponentProps<typeof Dialog> & {
    title: string | ReactNode
}

export function WaitListDialog({ open, title, ...rest }: DeleteDialogProps) {
    const { register, handleSubmit, formState: { isSubmitting, errors } } = useForm({ defaultValues: { firstName: '', email: '' } })

    const onSubmit = (values: any) => {
        console.log({ values })
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
                            placeholder="John"
                            label="First name"
                            {...register('firstName', {
                                required: { message: 'First name is required', value: true }
                            })}
                            hint={<ErrorHint>{errors.firstName?.message}</ErrorHint>}
                        />

                        <Input
                            placeholder="john@gmail.com"
                            label="Email address"
                            {...register('email', {
                                required: { message: 'Email address is required', value: true }
                            })}
                            hint={<ErrorHint>{errors.email?.message}</ErrorHint>}
                        />
                        <Button loading={isSubmitting}>Join</Button>
                    </form>
                </DialogDescription>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
