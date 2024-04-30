
import { supabase as client } from '~core/supabase';
import { useAuth } from '~utils/use-auth';

import './styles/global.css'
import { Button, Spinner } from 'ui';

function Popup() {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <div className="p-6 page">
                <Spinner />
            </div>
        )
    }

    if (!session) return;

    const handleLogout = async () => {
        await client.auth.signOut()
    }

    return (
        <div className="p-6 page">
            <p className="text-base mb-2 font-medium">Welcome {session.user.email}</p>
            <Button onClick={handleLogout}>Log Out</Button>
        </div>
    )
}

export default Popup