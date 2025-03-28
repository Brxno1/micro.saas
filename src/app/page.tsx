import { cookies } from 'next/headers'

import { auth } from '@/services/auth'

import { Chat } from './app/(home)/_components/_chat/chat-ai'

export default async function Home() {
  const session = await auth()

  const cookieStore = await cookies()
  const aiModel = cookieStore.get('aiModel')

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Chat modelName={aiModel?.value || 'AI'} user={session?.user} />
    </div>
  )
}
