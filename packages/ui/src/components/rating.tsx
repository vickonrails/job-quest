import clsx from 'clsx'
import { Star as FeatherStar } from 'react-feather'

type RatingSize = 'sm' | 'md' | 'lg'
interface RatingProps {
    value: number
    size?: RatingSize
    onClick?: (value: number) => void
}

const arr = [1, 2, 3, 4, 5]
const SIZE_LOOKUP = {
    sm: 16,
    md: 24,
    lg: 32
}

const Rating = ({ value, size = 'sm', onClick }: RatingProps) => {
    if (value > 5) value = 5;
    if (value === 0) value = 1

    return (
        <div className="flex">
            {arr.map((val) => {
                // render with a button wrapper if onClick is provided
                if (onClick) {
                    return (
                        <button
                            type="button"
                            onClick={() => onClick(val)}
                            key={val}
                        >
                            <Star size={size} state={value >= (val) ? 1 : 0} />
                        </button>
                    )
                }

                return (<Star size={size} key={val} state={value >= (val) ? 1 : 0} />)
            })}
        </div>
    )
}

const Star = ({ state, size }: { state: 0 | 1, size: RatingSize }) => {
    return (
        <FeatherStar
            size={SIZE_LOOKUP[size]}
            className={clsx('stroke-[#F2C94C] mr-1', state && 'fill-[#F2C94C] stroke-none')}
        />
    )
}

export { Rating }