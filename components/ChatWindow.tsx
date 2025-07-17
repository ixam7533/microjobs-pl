import React, { useState, useEffect, useRef } from 'react'
import styles from './ChatWindow.module.css'

export interface ChatMessage {
  id: number
  text: string
  fromMe: boolean
}

interface ChatWindowProps {
  chatId: number
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const [msgs, setMsgs] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/chats/${chatId}`)
      .then(async (res) => {
        if (!res.ok) return []
        try {
          return await res.json()
        } catch {
          console.error(`Invalid JSON from /api/chats/${chatId}`)
          return []
        }
      })
      .then(setMsgs)
      .catch((err) => {
        console.error('ChatWindow fetch error:', err)
        setMsgs([])
      })
      .finally(() => {
        setTimeout(() => endRef.current?.scrollIntoView(), 0)
      })
  }, [chatId])

  const send = () => {
    if (!text.trim()) return
    fetch(`/api/chats/${chatId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('Send failed')
        try {
          return await res.json()
        } catch {
          console.error('Invalid JSON on POST /api/chats/' + chatId)
          return null
        }
      })
      .then((newMsg) => {
        if (newMsg) {
          setMsgs((m) => [...m, newMsg])
          setText('')
          setTimeout(() => endRef.current?.scrollIntoView(), 0)
        }
      })
      .catch((err) => console.error('ChatWindow send error:', err))
  }

  return (
    <div className={styles.window}>
      <div className={styles.messages}>
        {msgs.map((m) => (
          <div key={m.id} className={m.fromMe ? styles.me : styles.them}>
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className={styles.inputRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Napisz wiadomość…"
        />
        <button onClick={send}>Wyślij</button>
      </div>
    </div>
  )
}
