import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from './Header.module.css'
import ThemeSwitch from './ThemeSwitch'
import PromotionCounter from './PromotionCounter'

interface User {
  email: string
  confirmed: boolean
}

type Theme = 'dark' | 'light' | 'night'

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (!res.ok) return null
        try {
          return await res.json()
        } catch {
          console.error('Invalid JSON from /api/auth/me')
          return null
        }
      })
      .then((data) => {
        if (data?.user) setUser(data.user)
      })
      .catch((err) => console.error('Network error on /api/auth/me:', err))

    // Nasłuchuj zmian motywu
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') as Theme || 'dark'
      setCurrentTheme(theme)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    // Ustaw początkowy motyw
    const initialTheme = document.documentElement.getAttribute('data-theme') as Theme || 'dark'
    setCurrentTheme(initialTheme)
    
    return () => observer.disconnect()
  }, [])

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        setUser(null)
        router.replace('/')
      } else {
        console.error('Logout failed:', res.status)
      }
    } catch (err) {
      console.error('Network error on logout:', err)
    }
  }

  const getBackgroundContent = () => {
    switch (currentTheme) {
      case 'light':
        // Jasny motyw - piękny gradient błękit → granat
        return <div className={styles.lightBackground} />
      case 'dark':
        return (
          <video autoPlay loop muted playsInline className={styles.video}>
            <source src="/smoke.mp4" type="video/mp4" />
          </video>
        )
      case 'night':
        return (
          <div className={styles.nightBackground} />
        )
      default:
        return (
          <video autoPlay loop muted playsInline className={styles.video}>
            <source src="/smoke.mp4" type="video/mp4" />
          </video>
        )
    }
  }

  return (
    <header className={styles.header} data-header="true">
      {/* 1. Tło z video lub gradientem */}
      <div className={styles.overlay}>
        {getBackgroundContent()}
        <div className={styles.tint} />
      </div>

      {/* 2. Pasek top */}
      <div className={styles.top}>
        <ThemeSwitch />
        <Link href="/" className={styles.logo}>
          <span>MicroJobs</span>
        </Link>
        
        
        

        <nav className={styles.nav}>
          <Link href="/pro" className={styles.proBtn}>
            ⭐ PRO
          </Link>
          {!user ? (
            <>
              <Link href="/login" className={styles.btn}>
                Logowanie
              </Link>
              <Link href="/register" className={styles.btn}>
                Rejestracja
              </Link>
            </>
          ) : (
            <>
              <PromotionCounter />
              <Link href="/add-new" className={styles.btn}>
                Dodaj ogłoszenie
              </Link>
              <Link href="/profile" className={styles.btn}>
                Mój profil
              </Link>

              <div className={styles.userMenu}>
                <span className={styles.email}>{user.email}</span>
                <button onClick={handleLogout} className={styles.btn}>
                  Wyloguj
                </button>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* 3. Krótki hero */}
      <div className={styles.hero}>
        <h1>Zarabiaj w wolnej chwili</h1>
        <p>Znajdź dorywcze prace w swoim mieście.</p>
      </div>

      {/* 4. Fioletowa fala */}
      <div className={styles.wave}>
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none">
          <path
            d="M0,20 C120,40 240,0 360,20 C480,40 600,0 720,20 C840,40 960,0 1080,20 C1200,40 1320,0 1440,20 L1440,40 L0,40 Z"
            fill="var(--color-gray)"
          />
        </svg>
      </div>
    </header>
  )
}
