import Link from 'next/link'
import { cn } from 'shared'
import { useSetupContext } from 'src/hooks/useSetupContext'

export function SetupLink(props: React.AllHTMLAttributes<HTMLAnchorElement> & { step: number }) {
    const { step: currentStep } = useSetupContext()
    const isActive = currentStep === props.step

    return (
        <li data-testid="setup-navigator" className={cn('text-muted-foreground hover:rounded-md hover:bg-muted rounded-l-none', isActive && 'border-l-4 hover:rounded-l-none border-primary text-accent-foreground')}>
            <Link href="" className="flex items-center gap-2 px-2 py-3" {...props} />
        </li>
    )
}