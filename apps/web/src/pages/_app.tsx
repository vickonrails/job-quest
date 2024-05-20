import { type User, type Session } from '@supabase/auth-helpers-react'
import { type AppProps } from 'next/app'

import '../styles/globals.css'

import { Toaster } from '@/components/toast'
import { TooltipProvider } from '@/components/tooltip'
import { ToastProvider } from '@radix-ui/react-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, useContext } from 'react'
import { useUser } from 'src/hooks/useUser'

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
  const { user } = useUser()

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <TooltipProvider>
          <AuthClientContext.Provider value={user}>
            <Component {...pageProps} />
          </AuthClientContext.Provider>
          <Toaster />
        </TooltipProvider>
      </ToastProvider>
    </QueryClientProvider>
  )
}

const AuthClientContext = createContext<User | null>(null)

// export function useUserContext() {
//   return useContext(AuthClientContext)
// }

export default MyApp