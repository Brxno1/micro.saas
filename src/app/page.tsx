import { NewFormAuth } from './auth/_components/auth-form'

export default async function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <NewFormAuth />
    </div>
  )
}
