import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, type Session } from '@supabase/auth-helpers-react'
import { type Database } from '../../lib/database.types'
import { type AppProps } from 'next/app'
import { useState } from 'react'

import '../styles/globals.css'
import 'ui/dist/styles.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastProvider } from '@radix-ui/react-toast'
import { Toaster } from '@components/toast'
import { TooltipProvider } from '@components/tooltip'

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

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <TooltipProvider>
            <Component {...pageProps} />
            <Toaster />
          </TooltipProvider>
        </ToastProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  )
}

export default MyApp