import { env } from '../lib/env'

type Path = '/dashboard' | '/auth' | '/' | '/chat'

export function getUrl(path: Path) {
  const baseUrl = env.NEXT_PUBLIC_APP_URL!

  return `${baseUrl}${path}`
}
