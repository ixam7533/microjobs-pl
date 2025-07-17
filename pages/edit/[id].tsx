import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Header from '../../components/Header'

export default function EditOffer() {
  const router = useRouter()
  const { id } = router.query
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/offers/${id}`)
      .then(r=>r.json())
      .then(setForm)
  }, [id])

  if (!form) return <p>Ładuję…</p>

  const handle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await fetch(`/api/offers/${id}`, {
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(form)
    })
    router.push('/profile')
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.type==='number' ? Number(e.target.value) : e.target.value
    setForm({ ...form, [e.target.name]: v })
  }

  return (
    <>
      <Header />
      <form onSubmit={handle} style={{/* Twój styl */}}>
        <input name="title" value={form.title} onChange={onChange}/>
        {/* … reszta pól … */}
        <button type="submit">Zapisz zmiany</button>
      </form>
    </>
  )
}
