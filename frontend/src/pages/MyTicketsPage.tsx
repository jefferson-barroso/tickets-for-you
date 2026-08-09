import {
    CalendarDays,
    Copy,
    MapPin,
    QrCode,
    Share2,
    Ticket,
    TicketCheck,
    X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api/client'
import { QRCodeSVG } from 'qrcode.react'

type UserTicket = {
    id: string
    ticketCode: string
    ticketTypeName?: string
    eventTitle?: string
    eventStartsAt?: string
    venueName?: string
    status: string
    qrPayload?: string
}

export default function MyTicketsPage() {
    const [tickets, setTickets] = useState<UserTicket[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedTicket, setSelectedTicket] = useState<UserTicket | null>(null)
    const [shareUrl, setShareUrl] = useState<string | null>(null)
    const [shareExpiresAt, setShareExpiresAt] = useState<string | null>(null)
    const [isSharing, setIsSharing] = useState(false)

    useEffect(() => {
        async function loadTickets() {
            try {
                const response = await apiFetch<UserTicket[]>('/tickets/me')
                setTickets(response)
            } catch (error) {
                setError(
                    error instanceof Error
                        ? error.message
                        : 'Não foi possível carregar seus ingressos.',
                )
            } finally {
                setIsLoading(false)
            }
        }

        loadTickets()
    }, [])

    async function generateShareLink(ticketId: string) {
        try {
            setIsSharing(true)
            setError(null)

            const response = await apiFetch<{ url: string; expiresAt: string }>(
                `/tickets/${ticketId}/share`,
                { method: 'POST' },
            )

            setShareUrl(response.url)
            setShareExpiresAt(response.expiresAt)
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível gerar o link de compartilhamento.',
            )
        } finally {
            setIsSharing(false)
        }
    }

    async function copyShareLink() {
        if (!shareUrl) return

        await navigator.clipboard.writeText(shareUrl)
    }

    if (isLoading) {
        return (
            <main className="grid min-h-screen place-items-center bg-stone-950 text-stone-300">
                <p role="status">Carregando seus ingressos...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-stone-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-5xl">
                <Link
                    to="/"
                    className="font-bold text-t4u-primary hover:text-t4u-secondary"
                >
                    ← Voltar para eventos
                </Link>

                <header className="mt-8">
                    <p className="font-bold text-t4u-primary">Área do cliente</p>
                    <h1 className="mt-2 text-4xl font-black">Meus ingressos</h1>
                    <p className="mt-3 text-stone-300">
                        Seus ingressos emitidos após a confirmação do pagamento.
                    </p>
                </header>

                {error && (
                    <div
                        role="alert"
                        className="mt-8 rounded-2xl border border-red-400/30 bg-red-950/40 p-5 text-red-100"
                    >
                        {error}
                    </div>
                )}

                {!error && tickets.length === 0 && (
                    <section className="mt-10 rounded-3xl border border-dashed border-white/20 p-10 text-center">
                        <Ticket size={48} className="mx-auto text-t4u-primary" aria-hidden="true" />
                        <h2 className="mt-4 text-xl font-black">Você ainda não tem ingressos</h2>
                        <p className="mt-2 text-stone-300">
                            Escolha um evento para realizar sua primeira reserva.
                        </p>
                        <Link
                            to="/"
                            className="mt-6 inline-block rounded-xl bg-t4u-primary px-5 py-3 font-black text-stone-950 hover:bg-t4u-secondary"
                        >
                            Ver eventos
                        </Link>
                    </section>
                )}

                <div className="mt-10 grid gap-5 md:grid-cols-2">
                    {tickets.map((ticket) => {
                        const date = ticket.eventStartsAt
                            ? new Intl.DateTimeFormat('pt-BR', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            }).format(new Date(ticket.eventStartsAt))
                            : null

                        return (
                            <article
                                key={ticket.id}
                                className="overflow-hidden rounded-3xl border border-white/10 bg-stone-900"
                            >
                                <div className="flex items-start justify-between bg-gradient-to-r from-t4u-primary to-t4u-secondary p-5 text-stone-950">
                                    <TicketCheck size={32} aria-hidden="true" />
                                    <span className="rounded-full bg-stone-950/15 px-3 py-1 text-xs font-black">
                                        {ticket.status}
                                    </span>
                                </div>

                                <div className="p-6">
                                    <p className="text-sm font-bold text-t4u-primary">
                                        {ticket.ticketTypeName ?? 'Ingresso'}
                                    </p>

                                    <h2 className="mt-2 text-2xl font-black">
                                        {ticket.eventTitle ?? 'Evento TicketsForYou'}
                                    </h2>

                                    {date && (
                                        <p className="mt-4 flex items-center gap-2 text-sm text-stone-300">
                                            <CalendarDays size={17} className="text-t4u-primary" aria-hidden="true" />
                                            {date}
                                        </p>
                                    )}

                                    {ticket.venueName && (
                                        <p className="mt-2 flex items-center gap-2 text-sm text-stone-300">
                                            <MapPin size={17} className="text-t4u-primary" aria-hidden="true" />
                                            {ticket.venueName}
                                        </p>
                                    )}

                                    <div className="mt-6 border-t border-dashed border-white/20 pt-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                                            Código do ingresso
                                        </p>
                                        <code className="mt-2 block break-all text-sm text-t4u-primary">
                                            {ticket.ticketCode}
                                        </code>
                                    </div>
                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedTicket(ticket)}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-t4u-primary px-4 py-3 font-black text-t4u-primary hover:bg-t4u-primary hover:text-stone-950"
                                        >
                                            <QrCode size={19} aria-hidden="true" />
                                            Ver QR Code
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => generateShareLink(ticket.id)}
                                            disabled={isSharing}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-t4u-primary px-4 py-3 font-black text-stone-950 hover:bg-t4u-secondary disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Share2 size={19} aria-hidden="true" />
                                            {isSharing ? 'Gerando...' : 'Compartilhar'}
                                        </button>
                                    </div>

                                </div>
                            </article>
                        )
                    })}
                </div>
            </div>
            {selectedTicket && (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="qr-code-title"
    className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-6"
  >
    <section className="w-full max-w-sm rounded-3xl bg-stone-100 p-6 text-center text-stone-950">
      <button
        type="button"
        onClick={() => setSelectedTicket(null)}
        aria-label="Fechar QR Code"
        className="ml-auto grid size-10 place-items-center rounded-lg hover:bg-stone-200"
      >
        <X aria-hidden="true" />
      </button>

      <h2 id="qr-code-title" className="mt-2 text-2xl font-black">
        Seu ingresso
      </h2>
      <p className="mt-2 text-sm text-stone-600">
        Apresente este QR Code na entrada do evento.
      </p>

      <div className="mx-auto mt-6 w-fit rounded-2xl bg-white p-4">
        <QRCodeSVG
          value={selectedTicket.qrPayload ?? selectedTicket.ticketCode}
          size={230}
          level="M"
          includeMargin
        />
      </div>

      <p className="mt-5 break-all font-mono text-xs text-stone-600">
        {selectedTicket.ticketCode}
      </p>
    </section>
  </div>
)}

{shareUrl && (
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="share-link-title"
    className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-6"
  >
    <section className="w-full max-w-lg rounded-3xl bg-stone-100 p-6 text-stone-950">
      <button
        type="button"
        onClick={() => setShareUrl(null)}
        aria-label="Fechar compartilhamento"
        className="ml-auto grid size-10 place-items-center rounded-lg hover:bg-stone-200"
      >
        <X aria-hidden="true" />
      </button>

      <h2 id="share-link-title" className="mt-2 text-2xl font-black">
        Link para compartilhar
      </h2>

      <p className="mt-3 text-sm leading-6 text-stone-600">
        Este link permite consultar o ingresso e expira em{' '}
        {shareExpiresAt &&
          new Intl.DateTimeFormat('pt-BR', {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(shareExpiresAt))}
        .
      </p>

      <div className="mt-6 flex gap-2">
        <input
          readOnly
          value={shareUrl}
          aria-label="Link temporário do ingresso"
          className="min-w-0 flex-1 rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm"
        />
        <button
          type="button"
          onClick={copyShareLink}
          className="inline-flex items-center gap-2 rounded-xl bg-t4u-primary px-4 py-3 font-black text-stone-950 hover:bg-t4u-secondary"
        >
          <Copy size={18} aria-hidden="true" />
          Copiar
        </button>
      </div>
    </section>
  </div>
)}
        </main>
    )
}