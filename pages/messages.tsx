import { useState, useEffect } from 'react'

export default function Messages() {
  type Message = {
    id: string | number
    sender: { email: string }
    content: string
  }
  const [inbox, setInbox] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [to, setTo] = useState('')

  useEffect(() => {
    fetch('/api/messages').then(r=>r.json()).then(setInbox)
  }, [])

  async function send() {
    await fetch('/api/messages', {
      method: 'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ receiverId: to, content })
    })
    setContent('')
    // odśwież skrzynkę
    const updated = await fetch('/api/messages').then(r=>r.json())
    setInbox(updated)
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Wiadomości</h2>
      <ul>
        {inbox.map(m=>(
          <li key={m.id}>
            Od: {m.sender.email} – {m.content}
          </li>
        ))}
      </ul>
      <div>
        <select onChange={e=>setTo(e.target.value)}>
          <option value="">Wybierz odbiorcę</option>
          {/* pobierz listę użytkowników z API/props */}
        </select>
        <textarea
          value={content}
          onChange={e=>setContent(e.target.value)}
          placeholder="Twoja wiadomość..."
        />
        <button onClick={send}>Wyślij</button>
      </div>
    </div>
  )
}
