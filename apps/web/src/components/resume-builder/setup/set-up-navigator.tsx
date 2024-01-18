import { cn } from '@utils/cn'
import { useSetupContext } from 'src/hooks/useSetupContext'

export function SetupNavigator(props: React.AllHTMLAttributes<HTMLAnchorElement> & { step: number }) {
    const { step: currentStep } = useSetupContext()
    const isActive = currentStep === props.step

    return (
        <li className={cn('px-2 py-3 text-muted-foreground', isActive && 'bg-gray-100 border-l-4 border-primary pl-3 text-primary')}>
            <a href="#" className="block" {...props} />
        </li>
    )
}