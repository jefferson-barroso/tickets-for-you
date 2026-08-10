import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Ticket,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import type { EventSummary } from './types'

type FeaturedEventsCarouselProps = {
  events: EventSummary[]
}

export function FeaturedEventsCarousel({
  events,
}: FeaturedEventsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    setActiveIndex(0)
  }, [events.length])

  useEffect(() => {
    if (events.length < 2 || isPaused) return

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % events.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [events.length, isPaused])

  if (events.length === 0) {
    return (
      <div className="hidden min-h-[430px] rounded-3xl border border-white/10 bg-stone-900 lg:grid lg:place-items-center">
        <p className="text-center text-stone-400">
          Os próximos destaques aparecerão aqui.
        </p>
      </div>
    )
  }

  const event = events[activeIndex]

  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(event.startsAt))

  function showPreviousEvent() {
    setActiveIndex((current) =>
      current === 0 ? events.length - 1 : current - 1,
    )
  }

  function showNextEvent() {
    setActiveIndex((current) => (current + 1) % events.length)
  }

  return (
    <section
      aria-label="Eventos em destaque"
      aria-roledescription="carrossel"
      className="relative min-h-[430px] overflow-hidden rounded-3xl border border-t4u-primary/30 bg-stone-900 shadow-2xl shadow-black/30"
    >
      {event.posterUrl ? (
        <img
          src={event.posterUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-t4u-primary via-[#ffb94a] to-t4u-secondary" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-stone-950/10" />

      <div className="relative flex min-h-[430px] flex-col justify-end p-7 sm:p-8">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-t4u-primary px-3 py-1 text-xs font-black text-stone-950">
          <Ticket size={15} aria-hidden="true" />
          EM DESTAQUE
        </p>

        <p className="mt-5 text-sm font-bold text-t4u-primary">
          {event.eventType === 'FILME' ? 'Cinema' : 'Show'}
        </p>

        <h2 className="mt-2 text-3xl font-black leading-tight text-white">
          {event.title}
        </h2>

        <p className="mt-3 text-sm text-stone-200">
          {date} · {event.venueName}
        </p>

        <Link
          to={`/events/${event.id}`}
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-t4u-primary px-5 py-3 font-black text-stone-950 transition hover:bg-t4u-secondary"
        >
          Ver evento
          <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </div>

      {events.length > 1 && (
        <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
          <button
            type="button"
            onClick={showPreviousEvent}
            aria-label="Evento anterior"
            className="grid size-10 place-items-center rounded-full bg-stone-950/75 text-white backdrop-blur hover:bg-t4u-primary hover:text-stone-950"
          >
            <ChevronLeft aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPaused((current) => !current)}
              aria-label={
                isPaused
                  ? 'Retomar troca automática dos destaques'
                  : 'Pausar troca automática dos destaques'
              }
              className="grid size-10 place-items-center rounded-full bg-stone-950/75 text-white backdrop-blur hover:bg-t4u-primary hover:text-stone-950"
            >
              {isPaused ? (
                <Play size={17} aria-hidden="true" />
              ) : (
                <Pause size={17} aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={showNextEvent}
              aria-label="Próximo evento"
              className="grid size-10 place-items-center rounded-full bg-stone-950/75 text-white backdrop-blur hover:bg-t4u-primary hover:text-stone-950"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {events.length > 1 && (
        <div className="absolute bottom-5 right-6 flex gap-2">
          {events.map((featuredEvent, index) => (
            <button
              key={featuredEvent.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Exibir destaque ${index + 1}: ${featuredEvent.title}`}
              aria-current={index === activeIndex}
              className={`h-2.5 rounded-full transition ${
                index === activeIndex
                  ? 'w-7 bg-t4u-primary'
                  : 'w-2.5 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}