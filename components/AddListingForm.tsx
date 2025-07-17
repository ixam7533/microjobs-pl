// components/AddListingForm.tsx
import { useState } from 'react'

type Props = { onSubmit: (data: FormData) => void }

export default function AddListingForm({ onSubmit }: Props) {
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')
  const [price, setPrice]       = useState<number>()
  const [location, setLoc]      = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, description, price, location, imageUrl } as any)
  }

  return (
    <form className="glass" onSubmit={handle}>
      <h2>Dodaj nowe ogłoszenie</h2>

      <input
        type="text"
        placeholder="Tytuł"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Opis"
        value={description}
        onChange={e => setDesc(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Cena (zł)"
        value={price || ''}
        onChange={e => setPrice(+e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Lokalizacja"
        value={location}
        onChange={e => setLoc(e.target.value)}
        required
      />

      <input
        type="url"
        placeholder="URL obrazka"
        value={imageUrl}
        onChange={e => setImageUrl(e.target.value)}
        required
      />

      <button type="submit">Wyślij</button>
    </form>
  )
}
