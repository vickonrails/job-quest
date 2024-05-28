import clsx from 'clsx';
import { type FC, type HTMLAttributes } from 'react';

type LogoProps = HTMLAttributes<HTMLElement>;

const Logo: FC<LogoProps> = ({ className, ...rest }) => {
    return (
        <h1 className={
            clsx(
                'text-muted-foreground hover:text-accent-foreground text-xl font-medium',
                className
            )
        } {...rest}>JobQuest</h1>
    )
}

export { Logo };
