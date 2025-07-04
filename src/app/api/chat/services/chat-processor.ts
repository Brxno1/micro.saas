import { Message, StreamTextResult } from 'ai'

import { generateSystemPrompt } from '../prompts'
import { weatherTool } from '../tools/weather'
import { errorHandler } from '../utils/error-handler'
import {
  processToolInvocations,
  validateMessages,
} from '../utils/message-filter'
import {
  findOrCreateChat,
  saveChatResponse,
  saveMessages,
} from './chat-operations'
import { createStreamText } from './create-stream-text'

type Role = 'user' | 'assistant'

type ProcessChatAndSaveMessagesProps = {
  messages: Array<{ role: Role; content: string }>
  name?: string
  chatId?: string
  isGhostChatMode?: boolean
  userId?: string
  model?: string
}

type AllTools = {
  getWeather: typeof weatherTool
}

type ProcessChatAndSaveMessagesResponse = {
  stream: StreamTextResult<AllTools, never> | null
  chatId?: string
  error?: string
}

export async function processChatAndSaveMessages({
  messages,
  name,
  chatId,
  userId,
  isGhostChatMode,
}: ProcessChatAndSaveMessagesProps): Promise<ProcessChatAndSaveMessagesResponse> {
  const processedMessages = processToolInvocations(messages)

  const finalMessages: Message[] = [
    {
      id: 'system',
      role: 'system',
      content: generateSystemPrompt({
        name: name || '',
        isLoggedIn: !!userId,
      }),
    },
    ...processedMessages.map((message, index) => ({
      id: `message-${index}`,
      role: message.role,
      content: message.content,
    })),
  ]

  if (isGhostChatMode || !userId) {
    const { stream, error } = await createStreamText({
      messages: finalMessages,
    })

    return {
      stream,
      error: error || undefined,
      chatId: undefined,
    }
  }

  const chatResponse = await findOrCreateChat(
    processedMessages,
    chatId,
    name,
    userId,
  )

  if (!chatResponse.success) {
    return {
      stream: null,
      error: chatResponse.error || 'Failed to create chat',
    }
  }

  const finalChatId = chatResponse.data
  const isNewChat = !chatId

  if (isNewChat || processedMessages.length > 0) {
    const messagesToSave = isNewChat
      ? processedMessages
      : [processedMessages[processedMessages.length - 1]].filter(
          (msg) => msg?.role === 'user',
        )

    if (messagesToSave.length > 0) {
      await saveMessages(messagesToSave, finalChatId)
    }
  }

  const isValid = validateMessages(finalMessages)

  if (!isValid) {
    return {
      stream: null,
      error: 'Mensagens inválidas ou vazias',
    }
  }

  const { stream, error } = await createStreamText({
    messages: finalMessages,
  })

  if (error) {
    return {
      stream: null,
      error: errorHandler(error),
    }
  }

  saveChatResponse(stream!, finalChatId, chatId, processedMessages)

  return {
    stream,
    chatId: finalChatId,
  }
}
