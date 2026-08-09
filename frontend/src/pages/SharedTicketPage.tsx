import { CalendarDays, MapPin, QrCode, TicketCheck } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { apiFetch } from '../api/client'

type SharedTicket = {
  eventTitle: string
  eventStartsAt: string
  venueName: string
  ticketTypeName: string
  status: string
  qrPayload: string
}

export default function SharedTicketPage() {
  const { token } = useParams()
  const [ticket, setTicket] = useState<SharedTicket | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadSharedTicket() {
      try {
        const response = await apiFetch<SharedTicket>(`/tickets/shared/${token}`)
        setTicket(response)
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar este ingresso.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadSharedTicket()
  }, [token])

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-950 text-stone-300">
        <p role="status">Carregando ingresso compartilhado...</p>
      </main>
    )
  }

  if (error || !ticket) {
    return (
      <main className="grid min-h-screen place-items-center bg-stone-950 px-6 text-center text-white">
        <section className="max-w-md rounded-3xl border border-white/10 bg-stone-900 p-8">
          <p className="font-bold text-t4u-primary">Link indisponível</p>
          <h1 className="mt-2 text-3xl font-black">
            Este ingresso não pode ser exibido
          </h1>
          <p role="alert" className="mt-4 text-stone-300">
            {error ?? 'O link é inválido ou expirou.'}
          </p>

          <Link
            to="/"
            className="mt-7 inline-block rounded-xl bg-t4u-primary px-5 py-3 font-black text-stone-950 hover:bg-t4u-secondary"
          >
            Ir para TicketsForYou
          </Link>
        </section>
      </main>
    )
  }

  const date = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(ticket.eventStartsAt))

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-stone-900 shadow-2xl">
        <header className="bg-gradient-to-r from-t4u-primary to-t4u-secondary p-7 text-stone-950">
          <TicketCheck size={42} aria-hidden="true" />
          <p className="mt-5 font-bold">Ingresso compartilhado</p>
          <h1 className="mt-1 text-3xl font-black">{ticket.eventTitle}</h1>
        </header>

        <div className="p-7">
          <p className="font-bold text-t4u-primary">{ticket.ticketTypeName}</p>

          <div className="mt-5 space-y-3 text-stone-300">
            <p className="flex items-center gap-3">
              <CalendarDays size={19} className="text-t4u-primary" aria-hidden="true" />
              {date}
            </p>

            <p className="flex items-center gap-3">
              <MapPin size={19} className="text-t4u-primary" aria-hidden="true" />
              {ticket.venueName}
            </p>
          </div>

          <div className="mt-7 flex items-center justify-between rounded-xl border border-t4u-primary/30 bg-t4u-primary/10 px-4 py-3">
            <span className="font-bold">Status</span>
            <span className="rounded-full bg-t4u-primary px-3 py-1 text-xs font-black text-stone-950">
              {ticket.status}
            </span>
          </div>

          <div className="mt-7 text-center">
            <p className="inline-flex items-center gap-2 font-bold text-t4u-primary">
              <QrCode size={20} aria-hidden="true" />
              QR Code do ingresso
            </p>

            <div className="mx-auto mt-4 w-fit rounded-2xl bg-white p-4">
              <QRCodeSVG
                value={ticket.qrPayload}
                size={230}
                level="M"
                includeMargin
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}