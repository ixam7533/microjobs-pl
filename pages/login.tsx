// pages/login.tsx

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AuthLayout from '../components/AuthLayout'
import SocialAuth from '../components/SocialAuth'
import styles from '../styles/AuthForm.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justRegistered, setJustRegistered] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (router.query.registered === '1') {
      setJustRegistered(true)
    }
  }, [router.query])

  const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember }),
    })

    const data = await res.json()
    if (res.ok) {
      // sukces → przekieruj
      router.push('/')
    } else {
      // błąd 4xx/5xx
      setError(data.error || `Błąd ${res.status}`)
    }
  } catch (err) {
    setError('Błąd sieci, spróbuj ponownie')
    console.error(err)
  }
}

  return (
    <AuthLayout>
      <form onSubmit={onSubmit} className={styles.form}>
        <h2 className={styles.heading}>Logowanie</h2>

        {justRegistered && (
          <p className={styles.success}>Rejestracja zakończona! Sprawdź e-mail.</p>
        )}
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className={styles.check}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Zapamiętaj mnie
        </label>

        <button type="submit" className={styles.submit}>
          Zaloguj się
        </button>

        <SocialAuth />

        <div className={styles.links}>
          <Link href="/register" className={styles.back}>
            ← Nie masz konta? Zarejestruj się
          </Link>
          <Link href="/oauth-setup" className={styles.oauthSetup}>
            ⚙️ Konfiguracja OAuth
          </Link>
          <Link href="/" className={styles.back}>
            ← Strona główna
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
