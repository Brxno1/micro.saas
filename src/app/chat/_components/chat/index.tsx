'use client'

import { Message as UIMessage, useChat } from '@ai-sdk/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import {
  ChevronsUpDown,
  GlobeIcon,
  ImageUp,
  MicIcon,
  MoreVertical,
  SendIcon,
  StopCircle,
} from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { MessagePart } from '@/app/api/chat/utils/message-parts'
import { TypingText } from '@/components/animate-ui/text/typing'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  AIButtonSubmit,
  AIForm,
  AIInputButton,
  AIInputModelSelect,
  AIInputModelSelectContent,
  AIInputModelSelectItem,
  AIInputModelSelectTrigger,
  AIInputModelSelectValue,
  AIInputToolbar,
  AIInputTools,
} from '@/components/ui/kibo-ui/ai/input'
import { useSidebar } from '@/components/ui/sidebar'
import { useUser } from '@/context/user-provider'
import { queryKeys } from '@/lib/query-client'
import { useChatStore } from '@/store/chat-store'

import { models } from '../../models/definitions'
import { Messages } from './message'

export interface CustomMessage {
  id: string
  createdAt: Date
  content: string
  role: string
  userId: string | null
  chatId: string
  parts?: MessagePart[]
}

interface ChatProps {
  initialMessages?: (UIMessage & Partial<CustomMessage>)[]
  currentChatId?: string
}

const schema = z.object({
  message: z.string().min(1),
})

export function Chat({ initialMessages, currentChatId }: ChatProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { user } = useUser()

  const { isMobile } = useSidebar()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      message: '',
    },
  })

  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const {
    model,
    modelProvider,
    setModel,
    setModelProvider,
    isGhostChatMode,
    chatInstanceKey,
    defineChatInstanceKey,
    getChatInstanceKey,
  } = useChatStore()

  const {
    input,
    messages,
    setMessages,
    status,
    handleInputChange,
    handleSubmit,
    stop,
    isLoading,
  } = useChat({
    initialMessages: initialMessages as (UIMessage & Partial<CustomMessage>)[],
    key: currentChatId || getChatInstanceKey(),
    api: '/api/chat',
    headers: {
      'x-user-name': user?.name || '',
      'x-user-id': user?.id || '',
      'x-chat-id': currentChatId || '',
      'x-ghost-mode': isGhostChatMode.toString(),
    },
    onError: (error) => {
      console.log(error)
    },
    onResponse: (response) => {
      const headerChatId = response.headers?.get('x-chat-id')

      if (headerChatId) {
        defineChatInstanceKey(headerChatId)
      }
    },

    onFinish: () => {
      if (!isGhostChatMode) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.chats.all,
        })

        const currentKey = getChatInstanceKey()
        if (currentKey) {
          setTimeout(() => {
            router.push(`/chat/${currentKey}`)
          }, 1000)
        }
      }
    },
  })

  const onDeleteMessageChat = (id: string) => {
    setMessages((prev) =>
      prev.filter((message: UIMessage) => message.id !== id),
    )
  }

  React.useEffect(() => {
    if (status === 'ready' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [status])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  React.useEffect(() => {
    if (chatInstanceKey && !initialMessages?.length) {
      setMessages([])
    }
  }, [chatInstanceKey, initialMessages])

  const handleChatSubmit = () => {
    handleSubmit()
  }

  const handleModelChange = (value: string) => {
    const selectedModel = models.find((m) => m.name === value)

    if (selectedModel) {
      setModel(selectedModel.name)
      setModelProvider(selectedModel.provider)
    }
  }

  return (
    <div className="flex h-full w-full flex-col rounded-lg rounded-b-xl border border-input">
      <div
        className="flex-1 overflow-auto p-2.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 scrollbar-thumb-rounded-md"
        ref={containerRef}
      >
        {messages.map((message) => (
          <Messages
            key={`${message.id}`}
            message={message}
            modelName={model}
            modelProvider={modelProvider}
            onDeleteMessageChat={onDeleteMessageChat}
            isStreaming={status === 'streaming'}
          />
        ))}

        <div ref={messagesEndRef} />
      </div>
      <Form {...form}>
        <AIForm
          onSubmit={form.handleSubmit(handleChatSubmit)}
          className="rounded-xl border border-input bg-card dark:bg-message"
        >
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    className="h-14 resize-none border-none shadow-none outline-none ring-0 transition-all duration-300 focus-visible:ring-0 sm:h-16"
                    disabled={status === 'streaming' || isLoading}
                    value={input}
                    ref={inputRef}
                    onChange={(ev) => {
                      field.onChange(ev)
                      handleInputChange(ev)
                    }}
                  />
                </FormControl>
                {!input && (
                  <TypingText
                    className="pointer-events-none absolute left-2 top-[40%] -translate-y-1/2 text-sm text-muted-foreground transition-all duration-300"
                    text="Pergunte-me qualquer coisa..."
                    delay={200}
                    loop
                  />
                )}
              </FormItem>
            )}
          />
          <AIInputToolbar className="p-2.5">
            <AIInputTools>
              {isMobile ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem disabled>
                      <ImageUp size={16} className="mr-2" />
                      <span>Imagem</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <MicIcon size={16} className="mr-2" />
                      <span>Áudio</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      <GlobeIcon size={16} className="mr-2" />
                      <span>Busca</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <AIInputButton
                    disabled
                    variant={'outline'}
                    className="bg-card dark:bg-message"
                  >
                    <ImageUp size={16} />
                  </AIInputButton>
                  <AIInputButton
                    disabled
                    variant={'outline'}
                    className="bg-card dark:bg-message"
                  >
                    <MicIcon size={16} />
                  </AIInputButton>
                  <AIInputButton
                    disabled
                    variant={'outline'}
                    className="bg-card dark:bg-message"
                  >
                    <GlobeIcon size={16} />
                  </AIInputButton>
                </div>
              )}
              <AIInputModelSelect
                value={model}
                onValueChange={handleModelChange}
              >
                <AIInputModelSelectTrigger
                  className="gap-1 border-none px-1.5 text-xs transition-all sm:text-sm"
                  disabled={status === 'streaming'}
                >
                  <AIInputModelSelectValue />
                  <ChevronsUpDown size={16} />
                </AIInputModelSelectTrigger>
                <AIInputModelSelectContent className="bg-card">
                  {models.map((m) => (
                    <AIInputModelSelectItem
                      value={m.name}
                      key={m.id}
                      disabled={m.disabled}
                      data-active={m.name === model}
                      className="cursor-pointer text-sm data-[active=true]:cursor-default data-[active=true]:bg-primary/10"
                    >
                      <Image
                        src={`https://img.logo.dev/${m.provider}?token=${process.env.NEXT_PUBLIC_LOGO_TOKEN}`}
                        alt={m.provider}
                        className="mr-2 inline-flex size-4 rounded-sm"
                        width={16}
                        height={16}
                      />
                      <span>{m.name}</span>
                    </AIInputModelSelectItem>
                  ))}
                </AIInputModelSelectContent>
              </AIInputModelSelect>
            </AIInputTools>
            {status === 'streaming' ? (
              <AIButtonSubmit onClick={stop} type="button">
                <span className="font-bold transition-all max-sm:hidden">
                  Parar
                </span>
                <StopCircle size={16} />
              </AIButtonSubmit>
            ) : (
              <AIButtonSubmit
                disabled={!input || form.formState.isSubmitting || isLoading}
                type="submit"
              >
                <span className="font-bold transition-all max-sm:hidden">
                  Enviar
                </span>
                <SendIcon size={16} />
              </AIButtonSubmit>
            )}
          </AIInputToolbar>
        </AIForm>
      </Form>
    </div>
  )
}
