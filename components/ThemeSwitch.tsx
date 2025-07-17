import { useEffect, useState } from 'react'
import { MoonIcon, SunIcon, SparklesIcon } from '@heroicons/react/24/solid'

type Theme = 'dark' | 'light' | 'night' | 'natura'

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>('natura')

  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const defaultTheme: Theme = saved || 'natura' // zmiana domyślnego motywu na natura
    setTheme(defaultTheme)
    document.documentElement.setAttribute('data-theme', defaultTheme)
  }, [])

  const cycleTheme = () => {
    const themeOrder: Theme[] = ['natura', 'dark', 'light', 'night'] // natura jako pierwszy
    const currentIndex = themeOrder.indexOf(theme)
    const nextTheme = themeOrder[(currentIndex + 1) % themeOrder.length]
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('theme', nextTheme)
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <MoonIcon className="icon" />
      case 'light':
        return <SunIcon className="icon" />
      case 'night':
        return <SparklesIcon className="icon" />
      case 'natura':
        return <span className="icon">🌿</span>
      default:
        return <MoonIcon className="icon" />
    }
  }

  return (
    <button onClick={cycleTheme} className="theme-button">
      {getThemeIcon()}
      <span className="theme-label">{theme}</span>

      <style jsx>{`
        .theme-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--bg-color);
          border: 2px solid var(--text-color);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--text-color);
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }
        .theme-button:hover {
          background: var(--text-color);
          color: var(--bg-color);
        }
        .icon {
          width: 16px;
          height: 16px;
          color: currentColor;
        }
        .theme-label {
          font-size: 11px;
          letter-spacing: 0.5px;
        }
      `}</style>
    </button>
  )
}
