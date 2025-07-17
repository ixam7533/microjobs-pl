import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../components/Header'
import styles from '../styles/AuthForm.module.css'

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (router.query.token && router.query.email) {
      setToken(router.query.token as string)
      setEmail(router.query.email as string)
    }
  }, [router.query])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Hasła nie są identyczne' })
      return
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Hasło musi mieć co najmniej 6 znaków' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // Tutaj w prawdziwej aplikacji byłaby weryfikacja tokenu
      // Na razie symulujemy sukces
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({ type: 'success', text: 'Hasło zostało zresetowane pomyślnie' })
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas resetowania hasła' })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className={styles.pageContainer}>
        <Header />
        <div className={styles.authContainer}>
          <div className={styles.authCard}>
            <h2>Nieprawidłowy link</h2>
            <p>Link resetujący hasło jest nieprawidłowy lub wygasł.</p>
            <button 
              onClick={() => router.push('/login')}
              className={styles.button}
            >
              Wróć do logowania
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2>Resetowanie hasła</h2>
          <p>Wprowadź nowe hasło dla konta: {email}</p>
          
          {message && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Nowe hasło</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Potwierdź hasło</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={styles.button}
            >
              {isLoading ? 'Resetowanie...' : 'Zresetuj hasło'}
            </button>
          </form>

          <div className={styles.authLinks}>
            <a href="/login">Wróć do logowania</a>
          </div>
        </div>
      </div>
    </div>
  )
}
