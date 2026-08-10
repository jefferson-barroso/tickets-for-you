import {
  Accessibility,
  Contrast,
  RotateCcw,
  Type,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useEffect, useState } from 'react'

type AccessibilityPreferences = {
  fontScale: number
  highContrast: boolean
  reduceMotion: boolean
}

const STORAGE_KEY = 't4u_accessibility_preferences'

const defaultPreferences: AccessibilityPreferences = {
  fontScale: 1,
  highContrast: false,
  reduceMotion: false,
}

export function AccessibilityToolbar() {
  const [isOpen, setIsOpen] = useState(false)

  const [preferences, setPreferences] =
    useState<AccessibilityPreferences>(() => {
      const storedPreferences = localStorage.getItem(STORAGE_KEY)

      if (!storedPreferences) return defaultPreferences

      try {
        return JSON.parse(storedPreferences) as AccessibilityPreferences
      } catch {
        return defaultPreferences
      }
    })

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--t4u-font-scale',
      String(preferences.fontScale),
    )

    document.documentElement.dataset.highContrast = String(
      preferences.highContrast,
    )

    document.documentElement.dataset.reduceMotion = String(
      preferences.reduceMotion,
    )

    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
  }, [preferences])

  function changeFontScale(amount: number) {
    setPreferences((current) => ({
      ...current,
      fontScale: Math.min(1.25, Math.max(0.9, current.fontScale + amount)),
    }))
  }

  function resetPreferences() {
    setPreferences(defaultPreferences)
  }

  return (
    <aside className="fixed bottom-5 right-5 z-[60]">
      {isOpen && (
        <section
          aria-label="Opções de acessibilidade"
          className="mb-3 w-72 rounded-2xl border border-white/20 bg-stone-950 p-4 text-white shadow-2xl"
        >
          <div className="flex items-center gap-2">
            <Accessibility className="text-t4u-primary" aria-hidden="true" />
            <h2 className="font-black">Acessibilidade</h2>
          </div>

          <div className="mt-5">
            <p className="text-sm font-bold text-stone-200">Tamanho do texto</p>

            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => changeFontScale(-0.05)}
                disabled={preferences.fontScale <= 0.9}
                aria-label="Diminuir tamanho do texto"
                className="grid size-10 place-items-center rounded-lg border border-white/20 hover:border-t4u-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ZoomOut size={18} aria-hidden="true" />
              </button>

              <span className="inline-flex items-center gap-2 text-sm">
                <Type size={17} aria-hidden="true" />
                {Math.round(preferences.fontScale * 100)}%
              </span>

              <button
                type="button"
                onClick={() => changeFontScale(0.05)}
                disabled={preferences.fontScale >= 1.25}
                aria-label="Aumentar tamanho do texto"
                className="grid size-10 place-items-center rounded-lg border border-white/20 hover:border-t4u-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ZoomIn size={18} aria-hidden="true" />
              </button>
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 p-3">
            <span className="text-sm font-bold">Alto contraste</span>
            <input
              type="checkbox"
              checked={preferences.highContrast}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  highContrast: event.target.checked,
                }))
              }
              className="size-5 accent-t4u-primary"
            />
          </label>

          <label className="mt-3 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 p-3">
            <span className="text-sm font-bold">Reduzir animações</span>
            <input
              type="checkbox"
              checked={preferences.reduceMotion}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  reduceMotion: event.target.checked,
                }))
              }
              className="size-5 accent-t4u-primary"
            />
          </label>

          <button
            type="button"
            onClick={resetPreferences}
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-t4u-primary hover:text-t4u-secondary"
          >
            <RotateCcw size={16} aria-hidden="true" />
            Restaurar preferências
          </button>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label={
          isOpen
            ? 'Fechar opções de acessibilidade'
            : 'Abrir opções de acessibilidade'
        }
        className="grid size-14 place-items-center rounded-full bg-t4u-primary text-stone-950 shadow-xl transition hover:bg-t4u-secondary focus:outline-none focus:ring-4 focus:ring-t4u-primary/50"
      >
        <Contrast aria-hidden="true" />
      </button>
    </aside>
  )
}