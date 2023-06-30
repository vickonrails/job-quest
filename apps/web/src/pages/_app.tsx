import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, type Session } from '@supabase/auth-helpers-react'
import { type Database } from 'apps/web/lib/database.types'
import { type AppProps } from 'next/app'
import { useState } from 'react'

import '../styles/globals.css'

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <Component {...pageProps} />
    </SessionContextProvider>
  )
}

export default MyApp