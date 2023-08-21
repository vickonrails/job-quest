import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, type Session } from '@supabase/auth-helpers-react'
import { type Database } from '../../lib/database.types'
import { type AppProps } from 'next/app'
import { useEffect, useState } from 'react'

import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0
    }
  }
})

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>())

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async (_event, _session) => {
      // TODO: might need to do this invalidation on some specific event like LoggedIn, etc
      await queryClient.invalidateQueries({
        queryKey: ['auth']
      });
    })
  }, [supabaseClient.auth])

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionContextProvider>
  )
}

export default MyApp