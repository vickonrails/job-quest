import clsx from 'clsx'
import React from 'react'
import { Star as FeatherStar } from 'react-feather'

// TODO: use native range type

type RatingSize = 'sm' | 'md' | 'lg'
interface RatingProps {
    value: number
    size?: RatingSize
}

const arr = [1, 2, 3, 4, 5]
const SIZE_LOOKUP = {
    sm: 16,
    md: 24,
    lg: 32
}

const Rating = ({ value, size = 'sm' }: RatingProps) => {
    if (value > 5) value = 5;

    return (
        <div className="flex">
            {arr.map((val) => <Star size={size} key={val} state={value >= (val) ? 1 : 0} />)}
        </div>
    )
}

const Star = ({ state, size }: { state: 0 | 1, size: RatingSize }) => {
    return (
        <FeatherStar
            size={SIZE_LOOKUP[size]}
            className={clsx('rating', state && 'active')}
        />
    )
}

export { Rating }