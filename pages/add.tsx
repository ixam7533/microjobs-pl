// pages/edit/add.tsx

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Modal from 'react-modal'
import styles from '../styles/AddAdvertisement.module.css'

type Theme = 'dark' | 'light' | 'night' | 'natura'

Modal.setAppElement('#__next')

const CATEGORIES = [
  'Elektronika',
  'Moda',
  'Dom i ogród',
  'Motoryzacja',
  'Praca'
]

export default function AddAdvertisementPage() {
  const router = useRouter()

  // stan motywu
  const [currentTheme, setCurrentTheme] = useState<Theme>('dark')

  // stan formularza
  const [title, setTitle]             = useState('')
  const [category, setCategory]       = useState('')
  const [description, setDescription] = useState('')
  const [autorenew, setAutorenew]     = useState(true)
  const [location, setLocation]       = useState('')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [images, setImages]           = useState<File[]>([])
  const [previews, setPreviews]       = useState<string[]>([])
  const [modalOpen, setModalOpen]     = useState(false)
  const dragItem = useRef<number | null>(null)

  // monitorowanie motywu
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute('data-theme') as Theme || 'dark'
      setCurrentTheme(theme)
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    
    const initialTheme = document.documentElement.getAttribute('data-theme') as Theme || 'dark'
    setCurrentTheme(initialTheme)
    
    return () => observer.disconnect()
  }, [])

  // generowanie preview obrazków
  useEffect(() => {
    const urls = images.map(f => URL.createObjectURL(f))
    setPreviews(urls)
    return () => urls.forEach(URL.revokeObjectURL)
  }, [images])

  // upload plików
  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setImages(Array.from(e.target.files).slice(0, 7))
  }

  // reorder drag&drop
  const onDragStart = (idx: number) => { dragItem.current = idx }
  const onDragOver = (e: React.DragEvent<HTMLImageElement>, idx: number) => {
    e.preventDefault()
    const from = dragItem.current
    if (from === null || from === idx) return
    const tmp = [...images]
    const moved = tmp.splice(from, 1)[0]
    tmp.splice(idx, 0, moved)
    dragItem.current = idx
    setImages(tmp)
  }

  // prosta walidacja
  const isTitleValid       = title.trim().length >= 16
  const isDescriptionValid = description.trim().length >= 40
  const isCategoryValid    = category !== ''
  const isEmailValid       = /\S+@\S+\.\S+/.test(contactEmail)
  const canSubmit          = isTitleValid && isDescriptionValid && isCategoryValid && isEmailValid

  // wysyłka
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    const fd = new FormData()
    fd.append('title', title)
    fd.append('category', category)
    images.forEach(f => fd.append('images', f))
    fd.append('description', description)
    fd.append('autorenew', String(autorenew))
    fd.append('location', location)
    fd.append('contactName', contactName)
    fd.append('contactEmail', contactEmail)
    fd.append('contactPhone', contactPhone)

    const res = await fetch('/api/auth/offers/add', {
      method: 'POST',
      body: fd
    })
    if (res.ok) router.push('/')
    else {
      const { error } = await res.json()
      alert(error)
    }
  }

  // zawartość modalu
  const PreviewContent = () => (
    <div className={styles.modalContent}>
      <h2>{title}</h2>
      <p><strong>Kategoria:</strong> {category}</p>
      {previews[0] && <img src={previews[0]} alt="main" width={200} />}
      <p>{description}</p>
      <p><strong>Lokalizacja:</strong> {location}</p>
      <p>
        <strong>Kontakt:</strong> {contactName}, {contactEmail}
        {contactPhone ? `, ${contactPhone}` : ''}
      </p>
      <button className={styles.btn} onClick={() => setModalOpen(false)}>
        Zamknij
      </button>
    </div>
  )

  const getBackgroundContent = () => {
    switch (currentTheme) {
      case 'light':
        // Jasny motyw - video chmury.mp4 (tu zostaje video na dole)
        return (
          <video
            className={styles.bgVideo}
            src="/chmury.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        )
      case 'dark':
        return (
          <video
            className={styles.bgVideo}
            src="/smoke.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        )
      case 'night':
        return <div className={styles.nightBackground} />
      case 'natura':
        return <div className={styles.naturaBackground} />
      default:
        return (
          <video
            className={styles.bgVideo}
            src="/smoke.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        )
    }
  }

  return (
    <div className={styles.pageWrapper}>
      {/* Tło wideo */}
      <div className={styles.bgContainer}>
        {getBackgroundContent()}
        <div className={styles.bgTint} />
      </div>

      {/* Przycisk powrotu */}
      <div className={styles.backWrapper}>
        <Link href="/" className={styles.backButton}>
          MicroJobs
        </Link>
      </div>

      {/* Formularz */}
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2>Dodaj ogłoszenie</h2>

        <div className={styles.field}>
          <label>Tytuł *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Min. 16 znaków"
            required
          />
          <div className={styles.counter}>{title.length}/70</div>
        </div>

        <div className={styles.field}>
          <label>Kategoria *</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Wybierz kategorię</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Zdjęcia (max 7)</label>
          <div
            className={styles.uploadArea}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            Dodaj zdjęcia
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFiles}
            />
          </div>
          <div className={styles.previews}>
            {previews.map((src, i) => (
              <img
                key={i}
                src={src}
                draggable
                onDragStart={() => onDragStart(i)}
                onDragOver={e => onDragOver(e, i)}
                alt={`preview ${i}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label>Opis *</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Min. 40 znaków"
            required
          />
          <div className={styles.counter}>{description.length}/9000</div>
        </div>
      </form>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <PreviewContent />
      </Modal>
    </div>
  )}