import Logo from 'data-base64:~assets/logo.png';
interface LinkedInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean
    added?: boolean
}

function getBtnContent(isLoading: boolean, added: boolean) {
    if (isLoading) return '...';
    if (added) return 'Already Added';
    return (
        <span className='flex items-center'>
            <img src={Logo} className='h-5 w-5' />
            <span className='ml-2'>Add</span>
        </span>
    );
}

export function LinkedInButton({ isLoading, added, ...rest }: LinkedInButtonProps) {
    return (
        <button
            disabled={isLoading || added}
            className="ml-1.5 leading-tight text-base font-medium cursor-pointer rounded-full border-linkedIn text-linkedIn px-5 py-[9px] shadow-outline hover:shadow-outline-hover hover:bg-linkedIn-hover disabled:opacity-30 disabled:pointer-events-none"
            {...rest}
        >
            {getBtnContent(isLoading, added)}
        </button>
    )
}