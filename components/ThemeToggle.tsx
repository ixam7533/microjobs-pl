// components/ThemeToggle.tsx
import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'


export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light'|'dark'>('dark')
  const [anim, setAnim]   = useState(false)

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light'|'dark') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  const handleToggle = () => {
    setAnim(true)
    setTimeout(() => {
      const next = theme === 'dark' ? 'light' : 'dark'
      setTheme(next)
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('theme', next)
      setAnim(false)
    }, 600)
  }

  return (
    <>
      <div className={`clip ${anim ? 'open' : ''}`}></div>
      <button
        onClick={handleToggle}
        aria-label="Przełącz motyw"
        className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg transition-colors"
      >
        {theme === 'dark' ? (
          <SunIcon className="h-6 w-6 text-yellow-400" />
        ) : (
          <MoonIcon className="h-6 w-6 text-gray-700" />
        )}
      </button>
    </>
  )
}
