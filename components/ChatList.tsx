import React, { useState, useEffect } from 'react'
import styles from './ChatList.module.css'

export interface ChatSummary {
  id: number
  withUser: string
  lastMessage: string
}

interface ChatListProps {
  onSelect: (chatId: number) => void
}

export default function ChatList({ onSelect }: ChatListProps) {
  const [chats, setChats] = useState<ChatSummary[]>([])

  useEffect(() => {
    fetch('/api/chats')
      .then(async (res) => {
        if (!res.ok) return []
        try {
          return await res.json()
        } catch {
          console.error('Invalid JSON from /api/chats')
          return []
        }
      })
      .then(setChats)
      .catch((err) => {
        console.error('ChatList fetch error:', err)
        setChats([])
      })
  }, [])

  return (
    <ul className={styles.list}>
      {chats.map((c) => (
        <li key={c.id} onClick={() => onSelect(c.id)}>
          <strong>{c.withUser}</strong>
          <p className={styles.snippet}>{c.lastMessage}</p>
        </li>
      ))}
    </ul>
  )
}
