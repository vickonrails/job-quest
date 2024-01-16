import { cn } from '@utils/cn'
import { ChevronLeftIcon } from 'lucide-react'
import { useSetupContext } from 'src/pages/profile/setup'

interface StepContainer extends React.HTMLAttributes<HTMLDivElement> {
    title: string
}

export function StepContainer({ title, children, ...rest }: StepContainer) {
    const { prev, canMovePrev } = useSetupContext()
    return (
        <section className="flex items-start flex-col gap-4" {...rest}>
            <button className={cn('inline-flex hover:underline -mx-1', !canMovePrev && 'opacity-50')} onClick={prev} disabled={!canMovePrev}>
                <ChevronLeftIcon />
                <span>Back</span>
            </button>

            <section className="w-full">
                {title && <h2 className="text-xl font-medium mb-1">{title}</h2>}
                {children}
            </section>
        </section>
    )
}