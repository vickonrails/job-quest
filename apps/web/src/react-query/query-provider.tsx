'use client'

import { Toaster } from '@/components/toast'
import { TooltipProvider } from '@/components/tooltip'
import { ToastProvider } from '@radix-ui/react-toast'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export const ReactQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 0,
                        refetchOnWindowFocus: false,
                        // With SSR, we usually want to set some default staleTime
                        // above 0 to avoid refetching immediately on the client
                        staleTime: 60 * 1000,
                    },
                },
            })
    )
    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <TooltipProvider>
                    {children}
                    <Toaster />
                </TooltipProvider>
            </ToastProvider>
        </QueryClientProvider>
    )
}
