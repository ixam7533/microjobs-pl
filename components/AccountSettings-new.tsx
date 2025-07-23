import { useState, useEffect } from 'react'
import styles from './AccountSettings.module.css'

interface AccountSettingsProps {
  user: { email: string; isAdmin?: boolean } | null
}

export default function AccountSettings({ user }: AccountSettingsProps) {
  const [activeSection, setActiveSection] = useState<'security' | 'preferences' | 'notifications' | 'account'>('security')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Security section state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Preferences section state
  const [preferences, setPreferences] = useState({
    theme: 'natura',
    language: 'pl',
    emailNotifications: true,
    pushNotifications: false
  })

  // Reset password state
  const [resetEmail, setResetEmail] = useState('')

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailOffers: true,
    emailMessages: true,
    emailPromotions: false,
    pushOffers: false,
    pushMessages: true,
    pushPromotions: false
  })

  // Account stats
  const [accountStats, setAccountStats] = useState({
    totalOffers: 0,
    totalMessages: 0,
    accountAge: 0,
    lastLogin: ''
  })

  useEffect(() => {
    if (user) {
      // Symulacja danych statystycznych
      setAccountStats({
        totalOffers: Math.floor(Math.random() * 20) + 1,
        totalMessages: Math.floor(Math.random() * 50) + 5,
        accountAge: Math.floor(Math.random() * 365) + 30,
        lastLogin: new Date().toISOString()
      })
    }
  }, [user])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Nowe hasła nie są identyczne' })
      setIsLoading(false)
      return
    }

    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Hasło zostało zmienione' })
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setMessage({ type: 'error', text: data.error || 'Błąd podczas zmiany hasła' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd podczas zmiany hasła' })
    }

    setIsLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: resetEmail })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Link resetujący został wysłany na email' })
        setResetEmail('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Błąd podczas resetowania hasła' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd podczas resetowania hasła' })
    }

    setIsLoading(false)
  }

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Symulacja zapisu preferencji
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Preferencje zostały zapisane' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd podczas zapisywania preferencji' })
    }

    setIsLoading(false)
  }

  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Symulacja zapisu ustawień powiadomień
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage({ type: 'success', text: 'Ustawienia powiadomień zostały zapisane' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd podczas zapisywania ustawień' })
    }

    setIsLoading(false)
  }

  const handleLogoutAllDevices = async () => {
    if (!window.confirm('Czy na pewno chcesz wylogować się ze wszystkich urządzeń?')) {
      return
    }

    setIsLoading(true)
    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      await fetch('/api/auth/logout-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      // Usuń tokeny z przeglądarki
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      localStorage.clear()
      sessionStorage.clear()
      
      setMessage({ type: 'success', text: 'Wylogowano ze wszystkich urządzeń' })
      
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd podczas wylogowywania' })
    }
    setIsLoading(false)
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Czy na pewno chcesz usunąć konto? Ta operacja jest nieodwracalna.')) {
      return
    }

    const finalConfirm = window.prompt('Wpisz "USUŃ KONTO" aby potwierdzić:')
    if (finalConfirm !== 'USUŃ KONTO') {
      setMessage({ type: 'error', text: 'Nieprawidłowe potwierdzenie' })
      return
    }

    setIsLoading(true)
    try {
      const token = document.cookie.split(';').find(row => row.startsWith('token='))?.split('=')[1]
      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        localStorage.clear()
        sessionStorage.clear()
        
        alert('Konto zostało usunięte')
        window.location.href = '/login'
      } else {
        const data = await response.json()
        setMessage({ type: 'error', text: data.error || 'Błąd podczas usuwania konta' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Błąd podczas usuwania konta' })
    }
    setIsLoading(false)
  }

  return (
    <div className={styles.accountSettings}>
      {message && (
        <div className={`${styles.message} ${message.type === 'success' ? styles.success : styles.error}`}>
          {message.text}
        </div>
      )}

      <div className={styles.settingsContainer}>
        {/* Navigation */}
        <div className={styles.sidebar}>
          <button 
            className={`${styles.navButton} ${activeSection === 'security' ? styles.active : ''}`}
            onClick={() => setActiveSection('security')}
          >
            🔒 Bezpieczeństwo
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'preferences' ? styles.active : ''}`}
            onClick={() => setActiveSection('preferences')}
          >
            🎨 Preferencje
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            🔔 Powiadomienia
          </button>
          <button 
            className={`${styles.navButton} ${activeSection === 'account' ? styles.active : ''}`}
            onClick={() => setActiveSection('account')}
          >
            👤 Informacje o koncie
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {activeSection === 'security' && (
            <div className={styles.section}>
              <h3>Bezpieczeństwo konta</h3>
              
              <div className={styles.securityActions}>
                <form onSubmit={handleChangePassword} className={styles.changePasswordForm}>
                  <h4>Zmiana hasła</h4>
                  <div className={styles.formGroup}>
                    <label>Obecne hasło</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nowe hasło</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Powtórz nowe hasło</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                      minLength={6}
                    />
                  </div>
                  <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                    {isLoading ? 'Zapisywanie...' : 'Zmień hasło'}
                  </button>
                </form>

                <div className={styles.securityOptions}>
                  <h4>Opcje bezpieczeństwa</h4>
                  <button 
                    onClick={handleLogoutAllDevices}
                    className={styles.warningButton}
                    disabled={isLoading}
                  >
                    🚪 Wyloguj ze wszystkich urządzeń
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className={styles.section}>
              <h3>Preferencje</h3>
              <form onSubmit={handleUpdatePreferences} className={styles.preferencesForm}>
                <div className={styles.formGroup}>
                  <label>Motyw</label>
                  <select 
                    value={preferences.theme}
                    onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                  >
                    <option value="light">Jasny</option>
                    <option value="dark">Ciemny</option>
                    <option value="night">Nocny</option>
                    <option value="natura">Natura</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label>Język</label>
                  <select 
                    value={preferences.language}
                    onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                  >
                    <option value="pl">Polski</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                  {isLoading ? 'Zapisywanie...' : 'Zapisz preferencje'}
                </button>
              </form>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className={styles.section}>
              <h3>Powiadomienia</h3>
              <form onSubmit={handleUpdateNotifications} className={styles.notificationsForm}>
                <div className={styles.notificationGroup}>
                  <h4>Powiadomienia email</h4>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.emailOffers}
                      onChange={(e) => setNotifications({...notifications, emailOffers: e.target.checked})}
                    />
                    Nowe ogłoszenia w interesujących kategoriach
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.emailMessages}
                      onChange={(e) => setNotifications({...notifications, emailMessages: e.target.checked})}
                    />
                    Nowe wiadomości
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.emailPromotions}
                      onChange={(e) => setNotifications({...notifications, emailPromotions: e.target.checked})}
                    />
                    Promocje i oferty specjalne
                  </label>
                </div>

                <div className={styles.notificationGroup}>
                  <h4>Powiadomienia push</h4>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.pushOffers}
                      onChange={(e) => setNotifications({...notifications, pushOffers: e.target.checked})}
                    />
                    Nowe ogłoszenia
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.pushMessages}
                      onChange={(e) => setNotifications({...notifications, pushMessages: e.target.checked})}
                    />
                    Nowe wiadomości
                  </label>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={notifications.pushPromotions}
                      onChange={(e) => setNotifications({...notifications, pushPromotions: e.target.checked})}
                    />
                    Promocje
                  </label>
                </div>

                <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                  {isLoading ? 'Zapisywanie...' : 'Zapisz ustawienia'}
                </button>
              </form>
            </div>
          )}

          {activeSection === 'account' && (
            <div className={styles.section}>
              <h3>Informacje o koncie</h3>
              
              <div className={styles.accountInfo}>
                <div className={styles.infoItem}>
                  <label>Email</label>
                  <div className={styles.infoValue}>{user?.email}</div>
                </div>
                <div className={styles.infoItem}>
                  <label>Typ konta</label>
                  <div className={styles.infoValue}>
                    {user?.isAdmin ? (
                      <span className={styles.adminBadge}>Administrator</span>
                    ) : (
                      <span className={styles.userBadge}>Użytkownik</span>
                    )}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <label>Ostatnie logowanie</label>
                  <div className={styles.infoValue}>
                    {accountStats.lastLogin ? new Date(accountStats.lastLogin).toLocaleString('pl-PL') : 'Nieznane'}
                  </div>
                </div>
              </div>

              <div className={styles.dangerZone}>
                <h4>Strefa niebezpieczna</h4>
                <button 
                  onClick={handleDeleteAccount}
                  className={styles.dangerButton}
                  disabled={isLoading}
                >
                  🗑️ Usuń konto na zawsze
                </button>
                <p className={styles.dangerWarning}>
                  Ta operacja jest nieodwracalna. Wszystkie Twoje dane zostaną usunięte.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
