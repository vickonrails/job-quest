import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, type Session } from '@supabase/auth-helpers-react'
import { type AppProps } from 'next/app'
import { useState } from 'react'
import { type Database } from 'shared'

import 'ui/dist/styles.css'
import 'resume-templates/dist/styles.css'
import '../styles/globals.css'

import { Toaster } from '@components/toast'
import { TooltipProvider } from '@components/tooltip'
import { ToastProvider } from '@radix-ui/react-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
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
  const [supabaseClient] = useState(() => createPagesBrowserClient<Database>())

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