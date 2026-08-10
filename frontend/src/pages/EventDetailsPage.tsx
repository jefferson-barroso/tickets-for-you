import { ArrowLeft, CalendarDays, MapPin, Ticket } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { apiFetch } from '../api/client'

type TicketType = {
  id: string
  name: string
  price: number
  availableQuantity: number
}

type EventDetails = {
  id: string
  title: string
  description: string | null
  eventType: 'SHOW' | 'FILME'
  startsAt: string
  venueName: string
  venueAddress: string
  posterUrl: string | null
  ticketTypes: TicketType[]
}

export default function EventDetailsPage() {
  const { eventId } = useParams()
  const [event, setEvent] = useState<EventDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [isReserving, setIsReserving] = useState(false)
  const [reservationError, setReservationError] = useState<string | null>(null)

  const total = useMemo(() => {
    if (!event) return 0

    return event.ticketTypes.reduce(
      (sum, ticketType) =>
        sum + ticketType.price * (quantities[ticketType.id] ?? 0),
      0,
    )
  }, [event, quantities])

  function updateQuantity(ticketTypeId: string, quantity: number) {
    setQuantities((current) => ({
      ...current,
      [ticketTypeId]: Math.max(0, quantity),
    }))
  }

  async function createReservation() {
    const items = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([ticketTypeId, quantity]) => ({
        ticketTypeId,
        quantity,
      }))

    if (items.length === 0) {
      setReservationError('Selecione pelo menos um ingresso.')
      return
    }

    if (!localStorage.getItem('t4u_token')) {
      setReservationError('Faça login para reservar seus ingressos.')
      return
    }

    try {
      setIsReserving(true)
      setReservationError(null)
      toast.success('Reserva criada. Finalize o pagamento para emitir seus ingressos.')
      const reservation = await apiFetch<{ id: string }>(
        '/reservations',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, items }),
        },
      )

      window.location.href = `/reservations/${reservation.id}/payment`
    } catch (error) {
      setReservationError(
        error instanceof Error
          ? error.message
          : 'Não foi possível criar sua reserva.',
      )
    } finally {
      setIsReserving(false)
    }
  }

  useEffect(() => {
    async function loadEvent() {
      try {
        const response = await apiFetch<EventDetails>(`/events/${eventId}`)
        setEvent(response)
      } catch {
        setError('Não foi possível carregar este evento.')
      } finally {
        setIsLoading(false)
      }
    }

    loadEvent()
  }, [eventId])

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-950 text-stone-300">
        <p role="status">Carregando evento...</p>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-950 px-6 text-center text-white">
        <div>
          <p className="text-lg">{error ?? 'Evento não encontrado.'}</p>
          <Link
            to="/"
            className="mt-5 inline-block rounded-lg bg-t4u-primary px-4 py-3 font-bold text-stone-950"
          >
            Voltar para eventos
          </Link>
        </div>
      </main>
    )
  }

  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(event.startsAt))

  return (
    <main className="min-h-screen bg-stone-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-t4u-primary"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Voltar para eventos
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="aspect-[2/3] overflow-hidden rounded-3xl bg-gradient-to-br from-t4u-primary to-t4u-secondary">
          {event.posterUrl ? (
            <img
              src={event.posterUrl}
              alt={`Pôster do evento ${event.title}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center">
              <Ticket size={72} aria-hidden="true" className="text-stone-950" />
            </div>
          )}
        </div>

        <section>
          <p className="font-bold text-t4u-primary">
            {event.eventType === 'FILME' ? 'Cinema' : 'Show'}
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            {event.title}
          </h1>

          {event.description && (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
              {event.description}
            </p>
          )}

          <dl className="mt-8 space-y-4 text-stone-300">
            <div className="flex gap-3">
              <CalendarDays className="shrink-0 text-t4u-primary" aria-hidden="true" />
              <dd>{date}</dd>
            </div>

            <div className="flex gap-3">
              <MapPin className="shrink-0 text-t4u-primary" aria-hidden="true" />
              <dd>
                {event.venueName} — {event.venueAddress}
              </dd>
            </div>
          </dl>

          <section className="mt-10">
            <h2 className="text-2xl font-black">Escolha seu ingresso</h2>

            <div className="mt-5 space-y-3">
              {event.ticketTypes.map((ticketType) => {
                const price = new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(ticketType.price)

                const quantity = quantities[ticketType.id] ?? 0
                const isUnavailable = ticketType.availableQuantity === 0

                return (
                  <article
                    key={ticketType.id}
                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-stone-900 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="font-bold">{ticketType.name}</h3>
                      <p className="mt-1 text-sm text-stone-400">
                        {ticketType.availableQuantity} disponíveis
                      </p>
                      <strong className="mt-2 block text-lg text-t4u-primary">
                        {price}
                      </strong>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(ticketType.id, quantity - 1)}
                        disabled={quantity === 0}
                        aria-label={`Remover um ingresso ${ticketType.name}`}
                        className="grid size-10 place-items-center rounded-lg border border-white/20 font-black disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>

                      <output
                        aria-label={`Quantidade de ingressos ${ticketType.name}`}
                        className="w-8 text-center font-bold"
                      >
                        {quantity}
                      </output>

                      <button
                        type="button"
                        onClick={() => updateQuantity(ticketType.id, quantity + 1)}
                        disabled={isUnavailable || quantity >= ticketType.availableQuantity}
                        aria-label={`Adicionar um ingresso ${ticketType.name}`}
                        className="grid size-10 place-items-center rounded-lg bg-t4u-primary font-black text-stone-950 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-t4u-primary/30 bg-t4u-primary/10 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold">Total da reserva</span>
                <strong className="text-xl text-t4u-primary">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(total)}
                </strong>
              </div>

              {reservationError && (
                <p role="alert" className="mt-4 text-sm text-red-300">
                  {reservationError}
                </p>
              )}

              <button
                type="button"
                onClick={createReservation}
                disabled={isReserving || total === 0}
                className="mt-5 w-full rounded-xl bg-t4u-primary px-5 py-3 font-black text-stone-950 transition hover:bg-t4u-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isReserving ? 'Criando reserva...' : 'Reservar ingressos'}
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  )
}