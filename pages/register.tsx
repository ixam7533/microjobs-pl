import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import AuthLayout from '../components/AuthLayout'
import styles from '../styles/AuthForm.module.css'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [confirmLink, setConfirmLink] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()

    if (res.ok) {
      setConfirmLink(data.confirmLink)
    } else {
      setError(data.error || 'Coś poszło nie tak.')
    }
  }

  if (confirmLink) {
    return (
      <AuthLayout>
        <div className={styles.confirm}>
          <p>Rejestracja powiodła się! Kliknij link poniżej, aby potwierdzić e-mail:</p>
          <a href={confirmLink}>{confirmLink}</a>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2 className={styles.heading}>Rejestracja</h2>
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.submit}>
          Zarejestruj się
        </button>

        <Link href="/login" className={styles.back}>
          ← Masz już konto? Zaloguj się
        </Link>
         <Link href="/" className={styles.back}>
          ← Strona główna
        </Link>
      </form>
    </AuthLayout>
  )
}
