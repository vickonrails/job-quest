import clsx from 'clsx';
import { type HTMLAttributes } from 'react';

export function WelcomeBanner({ className, ...rest }: HTMLAttributes<HTMLElement>) {
    return (
        <section
            className={clsx('w-full rounded-xl bg-primary min-h-[120px] p-4 text-white relative overflow-hidden', className)}
            {...rest}
        >
            <h2 className="w-full text-2xl font-medium mb-2">Welcome Victor</h2>
            <p className="text-sm max-w-md text-gray-200">“It may be necessary to encounter defeats, so you can know who you are, what you can rise from, how you can still come out of it.” —Maya Angelou</p>
            <Artefacts />
        </section>
    )
}


export function Artefacts() {
    return (
        <div className="absolute top-1/3 right-0">
            <span className="absolute border-[35px] rounded-full border-white/50 h-40 w-40 block right-20 -bottom-5" />
            <span className="absolute border-[40px] rounded-full border-white/50 h-52 w-52 block right-5 top-0" />
            <span className="absolute rounded-full h-14 w-14 block bg-white/30 -top-10 right-0" />
        </div>
    )
}