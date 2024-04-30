import { Spinner } from 'ui';
import { useAuth } from '~utils/use-auth';

type AuthGuardProps = React.HTMLAttributes<HTMLDivElement>

export function AuthGuard({ children: Cmp }: AuthGuardProps) {
    const { session, loading } = useAuth();

    if (loading) {
        return <Spinner variant="primary" className="m-auto mt-4" />
    }

    if (!session) {
        return (
            <p>You are not authenticated</p>
        )
    }

    return (
        <section>{Cmp}</section>
    )
}