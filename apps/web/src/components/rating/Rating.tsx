import clsx from 'clsx'
import React from 'react'
import { Star as FeatherStar } from 'react-feather'

// TODO: use native range type
interface RatingProps {
    value: 1 | 2 | 3 | 4 | 5
}

const Rating = ({ value }: RatingProps) => {
    // TODO: Memoize
    const arr = [1, 2, 3, 4, 5]

    return (
        <div className="flex">
            {arr.map((val) => <Star key={val} state={value >= (val) ? 1 : 0} />)}
        </div>
    )
}

const Star = ({ state }: { state: 0 | 1 }) => {
    return (
        <FeatherStar
            size={16}
            className={clsx('rating', state && 'active')}
        />
    )
}

export { Rating }