'use client'

import {
  LayoutDashboard,
  MessageSquare,
  Navigation,
  Settings2,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

import {
  SidebarHeaderTitle,
  SidebarNavLink,
} from '@/components/dashboard/sidebar'
import { Logo } from '@/components/logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar'

import { SidebarTriggerComponent } from './sidebar-trigger'
import { UserDropdown } from './user-dropdown'

export function AppSidebar() {
  const pathname = usePathname()

  const isActivePath = (path: string) => pathname === path

  const handleClickToNavigate = () => {
    toast('Em desenvolvimento!', {
      duration: 1000,
      position: 'top-center',
    })
  }

  const mainLinks = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      href: '/dashboard/settings',
      icon: Settings2,
      label: 'Configurações',
    },
  ]

  const bottomLinks = [
    {
      href: '/',
      icon: MessageSquare,
      label: 'Chat',
    },
    {
      href: '/?a=1',
      icon: Navigation,
      label: 'Site',
      onClick: handleClickToNavigate,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="w-full rounded-sm border-b border-border bg-muted dark:bg-background">
        <SidebarHeaderTitle className="flex w-full items-center justify-between py-1">
          <Logo className="ml-2" />
          <SidebarTriggerComponent text="Fechar" variant="outline" />
        </SidebarHeaderTitle>
      </SidebarHeader>
      <SidebarContent className="flex flex-grow flex-col">
        <SidebarGroup className="space-y-2">
          {mainLinks.map((link) => (
            <SidebarNavLink
              key={link.href}
              href={link.href}
              active={isActivePath(link.href)}
              className="px-3"
            >
              <link.icon className="mr-3 size-5" />
              {link.label}
            </SidebarNavLink>
          ))}
        </SidebarGroup>
        <SidebarGroup className="mb-3 mt-auto space-y-2">
          {bottomLinks.map((link) => (
            <SidebarNavLink
              key={link.href}
              href={link.href}
              active={isActivePath(link.href)}
              className="px-3"
              onClick={link.onClick}
            >
              <link.icon className="mr-3 size-5" />
              {link.label}
            </SidebarNavLink>
          ))}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex h-16 w-full items-center justify-center">
        <UserDropdown />
      </SidebarFooter>
    </Sidebar>
  )
}
