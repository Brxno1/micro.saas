'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Toaster } from 'sonner'

import { queryClient } from '@/lib/query-client'

import { ThemeProvider } from './theme/theme-provider'
import { SidebarProvider } from './ui/sidebar'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [sidebarState, setSidebarState] = useState<boolean | null>(null)

  useEffect(() => {
    const storedState = window.localStorage.getItem('sidebar_state')
    setSidebarState(storedState === 'true')
  }, [])

  if (sidebarState === null) {
    return null
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider defaultOpen={sidebarState}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>{children}</SessionProvider>
        </QueryClientProvider>
      </SidebarProvider>
      <Toaster
        richColors
        duration={3000}
        closeButton
        position="top-right"
        theme="system"
        pauseWhenPageIsHidden
        visibleToasts={2}
      />
    </ThemeProvider>
  )
}
