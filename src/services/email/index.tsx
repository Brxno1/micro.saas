import { User } from '@/services/database/generated'
import { Button, Html } from '@react-email/components'

interface EmailProps {
  url: string
  user: User | null
}

export function Email({ url, user }: EmailProps) {
  return (
    <Html lang="pt-BR">
      <div
        style={{
          height: '100svh',
          fontFamily: 'Arial, sans-serif',
          padding: '20px',
          backgroundColor: '#121212',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <h1 style={{ color: '#c084fc', fontSize: '24px', textAlign: 'center' }}>
          Bem-vindo ao nosso serviço
        </h1>
        <div>
          <img
            src={user!.image || ''}
            alt="Imagem de perfil"
            width={44}
            height={44}
          />
        </div>
        <p
          style={{
            fontSize: '16px',
            color: '#FFFFFF',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          Obrigado por se inscrever,{' '}
          <span style={{ color: '#c084fc', font: 'bold' }}>{user?.name}</span> !
          Para começar, clique no botão abaixo para confirmar o seu endereço de
          e-mail.
        </p>
        <div style={{ textAlign: 'center' }}>
          <Button
            href={url}
            style={{
              backgroundColor: '#6b0acc',
              color: '#FFFFFF',
              padding: '15px 30px',
              fontSize: '16px',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold',
            }}
          >
            Confirmar endereço de e-mail
          </Button>
        </div>
      </div>
    </Html>
  )
}

export default Email
