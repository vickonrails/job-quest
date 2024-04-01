import { AlignStartHorizontal, TableIcon } from 'lucide-react';
import { type HTMLAttributes } from 'react';
import { cn } from 'shared';

type View = 'kanban' | 'table';

export function ViewSwitcher({ view, setView }: { view: View, setView: (view: View) => void }) {
    return (
        <section className="flex justify-end mb-4">
            <article className="bg-gray-300 rounded-md p-1">
                <IconButton
                    active={view === 'table'}
                    onClick={() => setView('table')}
                >
                    <TableIcon size={18} />
                </IconButton>
                <IconButton
                    active={view === 'kanban'}
                    onClick={() => setView('kanban')}
                >
                    <AlignStartHorizontal size={18} />
                </IconButton>
            </article>
        </section>
    )
}

function IconButton({ active, className, ...props }: HTMLAttributes<HTMLButtonElement> & { active: boolean }) {
    return (
        <button className={cn('p-2 rounded-md text-gray-600', active && 'bg-white', className)} {...props}></button>
    )
}