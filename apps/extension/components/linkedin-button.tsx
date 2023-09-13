interface LinkedInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    added?: boolean
}

function getBtnContent(isLoading: boolean, added: boolean) {
    if (isLoading) return '...';
    if (added) return 'Already Added';
    return 'Add to JB';
}

export function LinkedInButton({ isLoading, added, ...rest }: LinkedInButtonProps) {
    return (
        <button
            disabled={isLoading || added}
            className="text-base font-medium cursor-pointer rounded-full border-linkedIn text-linkedIn px-5 py-[10px] shadow-outline hover:shadow-outline-hover hover:bg-linkedIn-hover disabled:opacity-30 disabled:pointer-events-none"
            {...rest}
        >
            {getBtnContent(isLoading, added)}
        </button>
    )
}