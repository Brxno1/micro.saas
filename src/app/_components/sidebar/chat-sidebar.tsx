'use client'

import { LayoutDashboard, MessageSquare } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { User } from 'next-auth'

import { ChatWithMessages } from '@/app/api/chat/actions/get-chats'
import { SidebarHeaderTitle } from '@/components/dashboard/sidebar'
import { Logo } from '@/components/logo'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar'
import { useChatStore } from '@/store/chat-store'
import { cn } from '@/utils/utils'

import { Historical } from '../../chat/_components/historical'
import { SidebarLinks } from './sidebar-links'
import { SidebarTriggerComponent } from './sidebar-trigger'
import { SidebarTriggerComponentMobile } from './sidebar-trigger-mobile'
import { UserDropdown } from './user-dropdown'

type ChatSidebarProps = {
  initialUser: User
  className?: string
  refreshChats: () => Promise<ChatWithMessages[]>
  chats: ChatWithMessages[]
}

export function ChatSidebar({
  initialUser,
  className,
  refreshChats,
  chats,
}: ChatSidebarProps) {
  const pathname = usePathname()
  const isActivePath = (path: string) => pathname === path

  const { open, isMobile } = useSidebar()
  const { setChatId } = useChatStore()

  const handleClick = () => {
    setChatId(undefined)
  }

  const mainLinks = [
    {
      href: '/chat',
      icon: MessageSquare,
      label: 'Chat',
      onClick: handleClick,
    },
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
  ]

  return (
    <Sidebar
      collapsible="icon"
      className={cn(className, 'group/sidebar')}
      side="left"
      data-sidebar={open ? 'open' : 'closed'}
    >
      <SidebarHeader className="w-full bg-card px-0">
        <SidebarHeaderTitle className="flex w-full items-center justify-between p-1.5 group-data-[sidebar=closed]/sidebar:py-2.5">
          <Logo className="mx-auto group-data-[sidebar=open]/sidebar:ml-2" />
          {isMobile ? (
            <SidebarTriggerComponentMobile
              variant="ghost"
              size="icon"
              className=""
            />
          ) : (
            <SidebarTriggerComponent
              className="!border-none group-data-[sidebar=closed]/sidebar:hidden"
              variant="ghost"
            />
          )}
        </SidebarHeaderTitle>
        <Separator />
      </SidebarHeader>
      <SidebarContent className="flex h-screen flex-col overflow-hidden bg-card">
        <SidebarGroup className="space-y-2">
          <SidebarLinks
            links={mainLinks}
            isActiveLink={isActivePath}
            open={open || isMobile}
          />
        </SidebarGroup>
        <Separator className="group-data-[sidebar=closed]/sidebar:hidden" />
        <SidebarGroup className="flex flex-1 flex-col overflow-hidden">
          {initialUser && (
            <Historical refreshChats={refreshChats} initialData={chats} />
          )}
        </SidebarGroup>
        {!isMobile && (
          <SidebarGroup
            data-mobile={isMobile}
            className="mt-auto data-[mobile=true]:flex group-data-[sidebar=open]/sidebar:hidden"
          >
            <SidebarTriggerComponent variant="ghost" className="!border-none" />
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="flex w-full items-center justify-center bg-card">
        <UserDropdown user={initialUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
