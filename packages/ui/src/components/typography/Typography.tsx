import { type FC, type HTMLAttributes } from 'react'
import clsx from 'clsx'

type TypeVariant = 'display-xl-bold' | 'display-xl-md' | 'display-xl' | 'display-lg-bold' |
    'display-lg-md' | 'display-lg' | 'display-md-bold' | 'display-md-md' | 'display-md' | 'display-sm-bold' |
    'display-sm-md' | 'display-sm' | 'display-xs-bold' | 'display-xs-md' | 'display-xs' | 'body-xl-bold' |
    'body-xl-md' | 'body-xl' | 'body-lg-bold' | 'body-lg-md' | 'body-lg' | 'body-md-bold' | 'body-md-md' |
    'body-md' | 'body-sm-bold' | 'body-sm-md' | 'body-sm' | 'body-xl-bold' | 'body-xl-md' | 'body-xl'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
    variant: TypeVariant
    as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const getTypeProperties = (variant: TypeVariant) => {
    switch (variant) {
        case 'display-xs-md':
            return 'font-medium text-2xl text-gray-800';

        case 'body-sm':
            return 'font-regular text-sm text-gray-500'
    }
}

export const Typography: FC<TypographyProps> = ({ as = 'p', variant, className, ...rest }) => {
    const classes = clsx(getTypeProperties(variant), className);

    switch (as) {
        case 'p':
            return <p className={classes} {...rest} />;

        case 'h1':
            return <h1 className={classes} {...rest} />;

        case 'h2':
            return <h2 className={classes} {...rest} />;

        case 'h3':
            return <h3 className={variant} {...rest} />;

        case 'h4':
            return <h4 className={variant} {...rest} />;

        case 'h5':
            return <h5 className={variant} {...rest} />;

        case 'h6':
            return <h6 className={variant} {...rest} />;
    }
}