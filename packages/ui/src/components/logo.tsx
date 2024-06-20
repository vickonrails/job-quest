import clsx from 'clsx';
import { type FC, type HTMLAttributes } from 'react';

type LogoProps = HTMLAttributes<HTMLElement>;

const Logo: FC<LogoProps> = ({ className, children, ...rest }) => {
    return (
        <h1 className={
            clsx(
                'text-muted-foreground flex items-center gap-2 hover:text-accent-foreground text-base',
                className
            )
        } {...rest}>
            {children}
            <img src="/logo.png" className="h-7 w-7 rounded-sm" alt="" />
            <span className="select-none">JobQuest</span>
        </h1>
    )
}

export { Logo };
