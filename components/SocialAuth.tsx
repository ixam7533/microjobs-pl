import { signIn, getProviders } from 'next-auth/react'
import { GoogleIcon, FacebookIcon, AppleIcon } from './SocialIcons'
import styles from './SocialAuth.module.css'
import { useEffect, useState } from 'react'

export default function SocialAuth() {
  const [providers, setProviders] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providers = await getProviders()
        setProviders(providers)
      } catch (error) {
        console.error('Error fetching providers:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProviders()
  }, [])

  const handleDemoOAuth = (provider: string) => {
    // Elegancki toast notification zamiast alert
    showToast(`🚀 Demo OAuth ${provider}`, 'Konfiguracja OAuth będzie dostępna w pełnej wersji aplikacji')
  }

  const showToast = (title: string, message: string) => {
    // Tworzymy toast notification
    const toast = document.createElement('div')
    toast.className = styles.toast
    toast.innerHTML = `
      <div class="${styles.toastHeader}">
        <span>${title}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="${styles.toastClose}">×</button>
      </div>
      <div class="${styles.toastBody}">${message}</div>
    `
    document.body.appendChild(toast)
    
    // Automatycznie usuń po 5 sekundach
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove()
      }
    }, 5000)
  }

  if (loading) {
    return (
      <div className={styles.socialAuth}>
        <div className={styles.divider}>
          <span>lub</span>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span>Ładowanie opcji logowania...</span>
        </div>
      </div>
    )
  }

  // Sprawdź czy mamy prawdziwe providery
  const hasRealProviders = providers && Object.keys(providers).length > 0

  return (
    <div className={styles.socialAuth}>
      <div className={styles.divider}>
        <span>lub zaloguj się przez</span>
      </div>
      
      <div className={styles.socialButtons}>
        {hasRealProviders ? (
          // Prawdziwe providery OAuth
          <>
            {providers.google && (
              <button 
                onClick={() => signIn('google', { callbackUrl: '/' })}
                className={`${styles.socialButton} ${styles.google}`}
              >
                <GoogleIcon />
                <span>Kontynuuj z Google</span>
              </button>
            )}
            
            {providers.facebook && (
              <button 
                onClick={() => signIn('facebook', { callbackUrl: '/' })}
                className={`${styles.socialButton} ${styles.facebook}`}
              >
                <FacebookIcon />
                <span>Kontynuuj z Facebook</span>
              </button>
            )}
            
            {providers.apple && typeof window !== 'undefined' && 
             (navigator.platform.indexOf('Mac') > -1 || 
              navigator.platform.indexOf('iPhone') > -1 || 
              navigator.platform.indexOf('iPad') > -1) && (
              <button 
                onClick={() => signIn('apple', { callbackUrl: '/' })}
                className={`${styles.socialButton} ${styles.apple}`}
              >
                <AppleIcon />
                <span>Kontynuuj z Apple</span>
              </button>
            )}
          </>
        ) : (
          // Piękne demo przyciski
          <>
            <button 
              onClick={() => handleDemoOAuth('Google')}
              className={`${styles.socialButton} ${styles.google} ${styles.demo}`}
            >
              <GoogleIcon />
              <span>Kontynuuj z Google</span>
              <div className={styles.shimmer}></div>
            </button>
            
            <button 
              onClick={() => handleDemoOAuth('Facebook')}
              className={`${styles.socialButton} ${styles.facebook} ${styles.demo}`}
            >
              <FacebookIcon />
              <span>Kontynuuj z Facebook</span>
              <div className={styles.shimmer}></div>
            </button>
            
            <button 
              onClick={() => handleDemoOAuth('Apple')}
              className={`${styles.socialButton} ${styles.apple} ${styles.demo}`}
            >
              <AppleIcon />
              <span>Kontynuuj z Apple</span>
              <div className={styles.shimmer}></div>
            </button>
          </>
        )}
      </div>
      
      {!hasRealProviders && (
        <div className={styles.demoNotice}>
          <div className={styles.demoIcon}>🎨</div>
          <div className={styles.demoText}>
            <strong>Demo wersja</strong>
            <span>Logowanie społecznościowe będzie dostępne w pełnej wersji</span>
          </div>
        </div>
      )}
    </div>
  )
}
