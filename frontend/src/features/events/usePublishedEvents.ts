import { useEffect, useState } from 'react'

import { apiFetch } from '../../api/client'
import type { EventSummary } from './types'

export function usePublishedEvents() {
  const [events, setEvents] = useState<EventSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadEvents() {
      try {
        const response = await apiFetch<EventSummary[]>('/events', {
          signal: controller.signal,
        })

        setEvents(response)
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return
        }

        setError('Não foi possível carregar os eventos.')
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()

    return () => controller.abort()
  }, [])

  return { events, isLoading, error }
}