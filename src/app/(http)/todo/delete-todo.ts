import { api } from '@/lib/axios'

export async function deleteTodo(id: string) {
  const response = await api.delete<{ message: string }>('/todo', {
    headers: {
      'X-Todo-ID': id,
    },
  })

  return response.data
}
