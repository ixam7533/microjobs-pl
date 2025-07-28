// components/AdminSubscriptionPanel.tsx
import React, { useState, useEffect } from 'react'
import styles from './AdminSubscriptionPanel.module.css'

interface User {
  id: number
  email: string
  name: string
  subscriptionType: string
  subscriptionStart: Date | null
  subscriptionEnd: Date | null
  promotionsUsed: number
  createdAt: Date
  isAdmin: boolean
  isSubscriptionActive: boolean
  daysRemaining: number | null
}

interface AdminSubscriptionPanelProps {
  isVisible: boolean
  onClose: () => void
}

export default function AdminSubscriptionPanel({ isVisible, onClose }: AdminSubscriptionPanelProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState<string>('')
  const [subscriptionType, setSubscriptionType] = useState<string>('PRO')
  const [duration, setDuration] = useState<number>(30)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    if (isVisible) {
      fetchUsers()
    }
  }, [isVisible])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
    setLoading(false)
  }

  const handleGrantSubscription = async () => {
    if (!selectedUser) {
      setMessage('Wybierz użytkownika')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/manage-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: selectedUser,
          subscriptionType,
          duration
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✅ Pomyślnie nadano ${subscriptionType} dla ${selectedUser}`)
        fetchUsers() // Odśwież listę
        setSelectedUser('')
      } else {
        setMessage(`❌ Błąd: ${data.error}`)
      }
    } catch (error) {
      setMessage('❌ Błąd podczas nadawania subskrypcji')
    }
    setLoading(false)
  }

  const getSubscriptionColor = (type: string) => {
    switch (type) {
      case 'PRO': return '#4CAF50'
      case 'PRO_PLUS': return '#FF9800'
      default: return '#9E9E9E'
    }
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? '#4CAF50' : '#F44336'
  }

  if (!isVisible) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2>👑 Panel Administracyjny - Zarządzanie Subskrypcjami</h2>
          <button className={styles.closeButton} onClick={onClose}>✕</button>
        </div>

        <div className={styles.content}>
          {/* Formularz nadawania subskrypcji */}
          <div className={styles.grantSection}>
            <h3>Nadaj Subskrypcję</h3>
            
            <div className={styles.formGroup}>
              <label>Wybierz użytkownika:</label>
              <select 
                value={selectedUser} 
                onChange={(e) => setSelectedUser(e.target.value)}
                className={styles.select}
              >
                <option value="">-- Wybierz użytkownika --</option>
                {users.map(user => (
                  <option key={user.id} value={user.email}>
                    {user.email} ({user.name || 'Bez nazwy'}) - {user.subscriptionType}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Typ subskrypcji:</label>
              <select 
                value={subscriptionType} 
                onChange={(e) => setSubscriptionType(e.target.value)}
                className={styles.select}
              >
                <option value="FREE">FREE</option>
                <option value="PRO">PRO</option>
                <option value="PRO_PLUS">PRO+</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Czas trwania (dni):</label>
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(parseInt(e.target.value))}
                min="1"
                max="365"
                className={styles.input}
              />
            </div>

            <button 
              onClick={handleGrantSubscription}
              disabled={loading}
              className={styles.grantButton}
            >
              {loading ? 'Przetwarzanie...' : 'Nadaj Subskrypcję'}
            </button>

            {message && (
              <div className={styles.message}>
                {message}
              </div>
            )}
          </div>

          {/* Lista użytkowników */}
          <div className={styles.usersSection}>
            <h3>Lista Użytkowników ({users.length})</h3>
            <div className={styles.usersList}>
              {users.map(user => (
                <div key={user.id} className={styles.userCard}>
                  <div className={styles.userInfo}>
                    <div className={styles.userEmail}>
                      {user.email} {user.isAdmin && '👑'}
                    </div>
                    <div className={styles.userName}>
                      {user.name || 'Bez nazwy'}
                    </div>
                  </div>
                  
                  <div className={styles.subscriptionInfo}>
                    <span 
                      className={styles.subscriptionType}
                      style={{ backgroundColor: getSubscriptionColor(user.subscriptionType) }}
                    >
                      {user.subscriptionType}
                    </span>
                    
                    <span 
                      className={styles.status}
                      style={{ color: getStatusColor(user.isSubscriptionActive) }}
                    >
                      {user.isSubscriptionActive ? 'Aktywna' : 'Nieaktywna'}
                    </span>
                    
                    {user.daysRemaining !== null && (
                      <span className={styles.daysRemaining}>
                        {user.daysRemaining} dni
                      </span>
                    )}
                  </div>
                  
                  <div className={styles.usageInfo}>
                    <small>
                      Promocje użyte: {user.promotionsUsed}
                    </small>
                    <small>
                      Dołączył: {new Date(user.createdAt).toLocaleDateString('pl-PL')}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
