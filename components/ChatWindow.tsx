import React, { useState, useEffect, useRef } from 'react'
import styles from './ChatWindow.module.css'

export interface ChatMessage {
  id: number
  text: string
  fromMe: boolean
}

interface ChatWindowProps {
  chatId: number
  offerId?: string | null
  onChatDeleted?: (chatId: number) => void
}

export default function ChatWindow({ chatId, offerId, onChatDeleted }: ChatWindowProps) {
  const [msgs, setMsgs] = useState<ChatMessage[]>([])
  const [text, setText] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const endRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleViewOffer = () => {
    console.log('🔍 handleViewOffer called, offerId:', offerId)
    if (offerId) {
      // Otwórz modal z ofertą (lub przekieruj na stronę oferty)
      const targetUrl = `/?offerId=${offerId}`
      console.log('🚀 Redirecting to:', targetUrl)
      window.location.href = targetUrl
    } else {
      console.warn('⚠️ No offerId available')
      alert('Brak informacji o ofercie powiązanej z tą rozmową.')
    }
  }

  const handleDeleteChat = async () => {
    if (!confirm('Czy na pewno chcesz usunąć tę rozmowę? Wszystkie wiadomości zostaną utracone.')) {
      return
    }

    try {
      const response = await fetch(`/api/chats/${chatId}/delete`, {
        method: 'DELETE',
        credentials: 'include'
      })
      
      if (response.ok) {
        onChatDeleted?.(chatId)
        alert('Rozmowa została usunięta')
      } else {
        const error = await response.json()
        alert(`Błąd: ${error.error || 'Nie udało się usunąć rozmowy'}`)
      }
    } catch (error) {
      console.error('Błąd usuwania rozmowy:', error)
      alert('Wystąpił błąd podczas usuwania rozmowy')
    }
  }

  useEffect(() => {
    fetch(`/api/chats/${chatId}`, {
      credentials: 'include'
    })
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
      credentials: 'include',
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const sendFile = async () => {
    if (!selectedFile) return
    
    const formData = new FormData()
    formData.append('file', selectedFile)
    
    try {
      const response = await fetch(`/api/chats/${chatId}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      
      if (response.ok) {
        const newMsg = await response.json()
        setMsgs((m) => [...m, newMsg])
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
        setTimeout(() => endRef.current?.scrollIntoView(), 0)
      }
    } catch (err) {
      console.error('File upload error:', err)
    }
  }

  const renderMessageContent = (text: string) => {
    if (text.startsWith('[IMAGE: ')) {
      const imagePath = text.match(/\[IMAGE: (.+?)\]/)?.[1]
      if (imagePath) {
        return (
          <img 
            src={imagePath} 
            alt="Załącznik" 
            className={styles.messageImage}
            onClick={() => window.open(imagePath, '_blank')}
          />
        )
      }
    }
    return text
  }

  return (
    <div className={styles.window}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          U
        </div>
        <div className={styles.userInfo}>
          <h4>Rozmowa</h4>
          <p>Aktywny</p>
        </div>
        <div className={styles.headerActions}>
          <button 
            className={styles.offerButton}
            onClick={handleViewOffer}
            disabled={!offerId}
          >
            📋 Zobacz ofertę
          </button>
          <button 
            className={styles.deleteButton}
            onClick={handleDeleteChat}
            title="Usuń rozmowę"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className={styles.messages}>
        {msgs.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.icon}>💬</div>
            <p>Brak wiadomości. Napisz pierwszą wiadomość!</p>
          </div>
        ) : (
          msgs.map((m) => (
            <div key={m.id} className={`${styles.message} ${m.fromMe ? styles.me : styles.them}`}>
              {renderMessageContent(m.text)}
              <div className={styles.timestamp}>
                {new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
      <div className={styles.inputRow}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={styles.attachButton}
          title="Załącz zdjęcie"
        >
          📎
        </button>
        {selectedFile && (
          <div className={styles.filePreview}>
            <span>{selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)}>✕</button>
          </div>
        )}
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Napisz wiadomość…"
          onKeyPress={(e) => e.key === 'Enter' && send()}
        />
        {selectedFile ? (
          <button onClick={sendFile} className={styles.sendButton}>
            Wyślij zdjęcie
          </button>
        ) : (
          <button onClick={send} disabled={!text.trim()} className={styles.sendButton}>
            Wyślij
          </button>
        )}
      </div>
    </div>
  )
}
