import type { User } from "@supabase/supabase-js"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

function IndexOptions() {
    const [user, setUser] = useStorage<User>({
        key: "user",
        instance: new Storage({
            area: "local"
        })
    })

    return (
        <main>
            Hi there
        </main>
    )
}

export default IndexOptions
