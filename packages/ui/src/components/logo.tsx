import clsx from 'clsx';
import { type FC, type HTMLAttributes } from 'react';

type LogoProps = HTMLAttributes<HTMLElement>;

const Logo: FC<LogoProps> = ({ className, children, ...rest }) => {
    return (
        <h1 className={
            clsx(
                'text-muted-foreground flex gap-2 hover:text-accent-foreground text-base',
                className
            )
        } {...rest}>
            {children}
            <span className="select-none text-primary">JobQuest</span>
        </h1>
    )
}

export { Logo };
