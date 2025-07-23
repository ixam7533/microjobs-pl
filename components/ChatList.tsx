import React, { useState, useEffect } from 'react'
import styles from './ChatList.module.css'

export interface ChatSummary {
  chatId: number
  withUser: string
  lastMessage: string | null
}

interface ChatListProps {
  onSelect: (chatId: number) => void
  onChatDeleted?: (chatId: number) => void // Callback gdy chat zostanie usunięty
}

export default function ChatList({ onSelect, onChatDeleted }: ChatListProps) {
  const [chats, setChats] = useState<ChatSummary[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = () => {
    fetch('/api/auth/chats', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) {
          console.error('Błąd API chats:', res.status, res.statusText)
          return []
        }
        try {
          const data = await res.json()
          console.log('Pobrano chaty:', data)
          return data
        } catch (error) {
          console.error('Invalid JSON from /api/auth/chats:', error)
          return []
        }
      })
      .then(setChats)
      .catch((err) => {
        console.error('ChatList fetch error:', err)
        setChats([])
      })
  }

  const handleSelect = (chatId: number) => {
    setSelectedId(chatId)
    onSelect(chatId)
  }

  const handleDeleteChat = async (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation() // Nie aktywuj chatu podczas usuwania
    
    if (!confirm('Czy na pewno chcesz usunąć tę rozmowę? Wszystkie wiadomości zostaną utracone.')) {
      return
    }

    try {
      const response = await fetch(`/api/chats/${chatId}/delete`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        // Usuń chat z lokalnego stanu
        setChats(chats.filter(chat => chat.chatId !== chatId))
        
        // Jeśli usunięty chat był wybrany, wyczyść wybór
        if (selectedId === chatId) {
          setSelectedId(null)
          onSelect(-1) // Sygnał do zamknięcia ChatWindow
        }
        
        // Wywołaj callback jeśli jest dostępny
        onChatDeleted?.(chatId)
        
        console.log('✅ Chat został usunięty')
      } else {
        const error = await response.json()
        alert(`Błąd: ${error.error || 'Nie udało się usunąć rozmowy'}`)
      }
    } catch (error) {
      console.error('💥 Error deleting chat:', error)
      alert('Wystąpił błąd podczas usuwania rozmowy')
    }
  }

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  if (chats.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.icon}>💬</div>
        <p>Brak rozmów</p>
        <p>Rozpocznij rozmowę klikając "Napisz wiadomość" przy ofercie</p>
      </div>
    )
  }

  return (
    <ul className={styles.list}>
      {chats.map((c) => (
        <li
          key={c.chatId}
          className={`${styles.chatItem} ${selectedId === c.chatId ? styles.selected : ''}`}
          onClick={() => handleSelect(c.chatId)}
        >
          <div className={styles.avatar}>
            {getInitials(c.withUser)}
          </div>
          <div className={styles.chatInfo}>
            <h4 className={styles.userName}>{c.withUser}</h4>
            <p className={styles.lastMessage}>
              {c.lastMessage || 'Brak wiadomości'}
            </p>
          </div>
          <div className={styles.chatActions}>
            <div className={styles.timestamp}>
              teraz
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
