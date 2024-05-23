import BackButton from '@/components/back-button'
import { cn } from 'shared'
import { useSetupContext } from 'src/hooks/useSetupContext'

interface StepContainer extends React.HTMLAttributes<HTMLDivElement> {
    title: string
    description?: string
}

export function StepContainer({ title, description, children, ...rest }: StepContainer) {
    const { prev, canMovePrev } = useSetupContext()
    return (
        <section className="flex items-start flex-col gap-4 w-4/5 mx-auto pb-8" {...rest}>
            <BackButton
                onClick={prev}
                className={cn('inline-flex hover:underline -mx-1 p-0 disabled:opacity-50')}
                disabled={!canMovePrev}
            >
                Go back
            </BackButton>

            <section className="w-full">
                {title && <h2 className="text-xl font-medium mb-1">{title}</h2>}
                {description && <p className="text-gray-500 mb-4 text-sm">{description}</p>}
                {children}
            </section>
        </section>
    )
}