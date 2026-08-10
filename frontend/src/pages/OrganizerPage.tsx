import {
    CheckCircle2,
    Film,
    LoaderCircle,
    Plus,
    Search,
    Send,
    Trash2,
} from 'lucide-react'
import { FormEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

import { apiFetch } from '../api/client'
import { Link } from 'react-router-dom'

type Movie = {
    id: number
    title: string
    originalTitle: string
    overview: string | null
    releaseDate: string | null
    posterUrl: string | null
}

type CreatedEvent = {
    id: string
    title: string
    status: string
}

export default function OrganizerPage() {
    const [query, setQuery] = useState('')
    const [movies, setMovies] = useState<Movie[]>([])
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [startsAt, setStartsAt] = useState('')
    const [venueName, setVenueName] = useState('')
    const [venueAddress, setVenueAddress] = useState('')
    const [posterUrl, setPosterUrl] = useState('')

    const [ticketTypes, setTicketTypes] = useState([
        {
            id: crypto.randomUUID(),
            name: 'Inteira',
            price: '45',
            totalQuantity: '100',
        },
    ])

    const [createdEvent, setCreatedEvent] = useState<CreatedEvent | null>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const eventFormRef = useRef<HTMLElement>(null)

    const minDateTime = new Date(Date.now() + 5 * 60 * 1000)
        .toISOString()
        .slice(0, 16)

    const maxDateTime = '2100-12-31T23:59'

    async function searchMovies(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (query.trim().length < 2) {
            setError('Informe ao menos 2 caracteres para buscar um filme.')
            return
        }

        try {
            setIsSearching(true)
            setError(null)

            const response = await apiFetch<Movie[]>(
                `/catalog/movies?query=${encodeURIComponent(query.trim())}`,
            )

            setMovies(response)
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível consultar o catálogo.',
            )
        } finally {
            setIsSearching(false)
        }
    }

    function selectMovie(movie: Movie) {
        setSelectedMovie(movie)
        setTitle(movie.title)
        setDescription(movie.overview ?? '')
        setPosterUrl(movie.posterUrl ?? '')
        setCreatedEvent(null)

        setTimeout(() => {
            eventFormRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            })
        }, 100)
    }

    function addTicketType() {
        setTicketTypes((current) => [
            ...current,
            {
                id: crypto.randomUUID(),
                name: '',
                price: '',
                totalQuantity: '',
            },
        ])
    }

    function updateTicketType(
        id: string,
        field: 'name' | 'price' | 'totalQuantity',
        value: string,
    ) {
        setTicketTypes((current) =>
            current.map((ticketType) =>
                ticketType.id === id
                    ? { ...ticketType, [field]: value }
                    : ticketType,
            ),
        )
    }

    function removeTicketType(id: string) {
        setTicketTypes((current) =>
            current.length > 1
                ? current.filter((ticketType) => ticketType.id !== id)
                : current,
        )
    }

    async function createEvent(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const eventDate = new Date(startsAt)

        if (
            Number.isNaN(eventDate.getTime()) ||
            eventDate <= new Date() ||
            eventDate.getFullYear() > 2100
        ) {
            setError('Informe uma data e horário futuros válidos, até o ano de 2100.')
            return
        }

        try {
            setIsCreating(true)
            setError(null)
            setCreatedEvent(null)

            const response = await apiFetch<CreatedEvent>('/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    eventType: 'FILME',
                    startsAt: new Date(startsAt).toISOString(),
                    venueName,
                    venueAddress,
                    posterUrl: posterUrl.trim() || null,
                    ticketTypes: ticketTypes.map((ticketType) => ({
                        name: ticketType.name,
                        price: Number(ticketType.price),
                        totalQuantity: Number(ticketType.totalQuantity),
                    })),
                }),
            })

            setCreatedEvent(response)
            toast.success('Evento criado como rascunho.')

            requestAnimationFrame(() => {
                eventFormRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                })
            })
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível criar o evento.',
            )
        } finally {
            setIsCreating(false)
        }
    }

    async function publishEvent() {
        if (!createdEvent) return

        try {
            setIsPublishing(true)
            setError(null)

            const response = await apiFetch<CreatedEvent>(
                `/events/${createdEvent.id}/publish`,
                { method: 'PATCH' },
            )

            setCreatedEvent(response)
            toast.success('Evento publicado e disponível para venda.')
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível publicar o evento.',
            )
        } finally {
            setIsPublishing(false)
        }
    }

    return (
        <main className="min-h-screen bg-stone-950 px-6 py-12 text-white">
            <div className="mx-auto max-w-6xl">
                <Link
                    to="/"
                    className="font-bold text-t4u-primary hover:text-t4u-secondary"
                >
                    ← Voltar para eventos
                </Link>

                <header className="mt-8">
                    <p className="font-bold text-t4u-primary">Área do organizador</p>
                    <h1 className="mt-2 text-4xl font-black">Criar novo evento</h1>
                    <p className="mt-3 max-w-2xl text-stone-300">
                        Busque um filme no catálogo TMDb, defina os dados da sessão e
                        publique os ingressos.
                    </p>
                </header>

                <form
                    onSubmit={searchMovies}
                    className="mt-8 flex flex-col gap-3 sm:flex-row"
                >
                    <label htmlFor="movie-search" className="sr-only">
                        Buscar filme
                    </label>

                    <input
                        id="movie-search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Ex.: De Volta para o Futuro"
                        className="min-w-0 flex-1 rounded-xl border border-white/15 bg-stone-900 px-4 py-3 text-white outline-none placeholder:text-stone-500 focus:border-t4u-primary"
                    />

                    <button
                        type="submit"
                        disabled={isSearching}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-t4u-primary px-5 py-3 font-black text-stone-950 hover:bg-t4u-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSearching ? (
                            <>
                                <LoaderCircle className="animate-spin" aria-hidden="true" />
                                Buscando...
                            </>
                        ) : (
                            <>
                                <Search aria-hidden="true" />
                                Buscar
                            </>
                        )}
                    </button>
                </form>

                {error && (
                    <p
                        role="alert"
                        className="mt-6 rounded-2xl border border-red-400/30 bg-red-950/40 p-5 text-red-100"
                    >
                        {error}
                    </p>
                )}

                {movies.length > 0 && (
                    <section className="mt-10">
                        <h2 className="text-2xl font-black">Resultados do catálogo</h2>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {movies.map((movie) => (
                                <button
                                    key={movie.id}
                                    type="button"
                                    onClick={() => selectMovie(movie)}
                                    className={`overflow-hidden rounded-2xl border text-left transition ${selectedMovie?.id === movie.id
                                        ? 'border-t4u-primary ring-2 ring-t4u-primary/50'
                                        : 'border-white/10 hover:border-t4u-primary/60'
                                        }`}
                                >
                                    <div className="aspect-[2/3] bg-stone-900">
                                        {movie.posterUrl ? (
                                            <img
                                                src={movie.posterUrl}
                                                alt={`Pôster do filme ${movie.title}`}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="grid h-full place-items-center">
                                                <Film
                                                    size={54}
                                                    className="text-t4u-primary"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-stone-900 p-4">
                                        <h3 className="font-black">{movie.title}</h3>
                                        {movie.releaseDate && (
                                            <p className="mt-1 text-sm text-stone-400">
                                                Lançamento: {movie.releaseDate}
                                            </p>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>
                )}

                {selectedMovie && (
                    <section
                        ref={eventFormRef}
                        className="mt-10 scroll-mt-6 rounded-3xl border border-white/10 bg-stone-900 p-6 sm:p-8"
                    >
                        <p className="font-bold text-t4u-primary">Dados do evento</p>
                        <h2 className="mt-2 text-2xl font-black">
                            Criar sessão de cinema
                        </h2>

                        <form onSubmit={createEvent} className="mt-7 grid gap-5">
                            <div>
                                <label htmlFor="title" className="font-bold">
                                    Título do evento
                                </label>
                                <input
                                    id="title"
                                    required
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    className="mt-2 w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 outline-none focus:border-t4u-primary"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="font-bold">
                                    Descrição
                                </label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    rows={4}
                                    className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-stone-950 px-4 py-3 outline-none focus:border-t4u-primary"
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="startsAt" className="font-bold">
                                        Data e horário
                                    </label>
                                    <input
                                        id="startsAt"
                                        type="datetime-local"
                                        required
                                        min={minDateTime}
                                        max={maxDateTime}
                                        value={startsAt}
                                        onChange={(event) => setStartsAt(event.target.value)}
                                        className="mt-2 w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 outline-none focus:border-t4u-primary"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="posterUrl" className="font-bold">
                                        URL do pôster
                                    </label>
                                    <input
                                        id="posterUrl"
                                        type="url"
                                        value={posterUrl}
                                        onChange={(event) => setPosterUrl(event.target.value)}
                                        className="mt-2 w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 outline-none focus:border-t4u-primary"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="venueName" className="font-bold">
                                        Local
                                    </label>
                                    <input
                                        id="venueName"
                                        required
                                        value={venueName}
                                        onChange={(event) => setVenueName(event.target.value)}
                                        placeholder="Ex.: Cine T4U"
                                        className="mt-2 w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 outline-none focus:border-t4u-primary"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="venueAddress" className="font-bold">
                                        Endereço
                                    </label>
                                    <input
                                        id="venueAddress"
                                        required
                                        value={venueAddress}
                                        onChange={(event) => setVenueAddress(event.target.value)}
                                        placeholder="Ex.: Av. Paulista, 1000"
                                        className="mt-2 w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 outline-none focus:border-t4u-primary"
                                    />
                                </div>
                            </div>

                            <fieldset className="rounded-2xl border border-white/10 p-5">
                                <div className="flex items-center justify-between gap-4">
                                    <legend className="font-black text-t4u-primary">
                                        Setores de ingresso
                                    </legend>

                                    <button
                                        type="button"
                                        onClick={addTicketType}
                                        className="inline-flex items-center gap-2 rounded-lg border border-t4u-primary/60 px-3 py-2 text-sm font-bold text-t4u-primary hover:bg-t4u-primary hover:text-stone-950"
                                    >
                                        <Plus size={17} aria-hidden="true" />
                                        Adicionar setor
                                    </button>
                                </div>

                                <div className="mt-5 space-y-4">
                                    {ticketTypes.map((ticketType, index) => (
                                        <div
                                            key={ticketType.id}
                                            className="rounded-xl border border-white/10 bg-stone-950/60 p-4"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <p className="font-bold text-stone-300">
                                                    Setor {index + 1}
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => removeTicketType(ticketType.id)}
                                                    disabled={ticketTypes.length === 1}
                                                    aria-label={`Remover setor ${index + 1}`}
                                                    className="inline-flex items-center gap-2 text-sm font-bold text-red-300 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <Trash2 size={17} aria-hidden="true" />
                                                    Remover
                                                </button>
                                            </div>

                                            <div className="grid gap-5 sm:grid-cols-3">
                                                <div>
                                                    <label
                                                        htmlFor={`ticket-name-${ticketType.id}`}
                                                        className="font-bold"
                                                    >
                                                        Nome
                                                    </label>
                                                    <input
                                                        id={`ticket-name-${ticketType.id}`}
                                                        required
                                                        value={ticketType.name}
                                                        onChange={(event) =>
                                                            updateTicketType(ticketType.id, 'name', event.target.value)
                                                        }
                                                        placeholder="Ex.: Meia-entrada"
                                                        className="mt-2 w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 outline-none focus:border-t4u-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor={`ticket-price-${ticketType.id}`}
                                                        className="font-bold"
                                                    >
                                                        Preço (R$)
                                                    </label>
                                                    <input
                                                        id={`ticket-price-${ticketType.id}`}
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        required
                                                        value={ticketType.price}
                                                        onChange={(event) =>
                                                            updateTicketType(ticketType.id, 'price', event.target.value)
                                                        }
                                                        className="mt-2 w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 outline-none focus:border-t4u-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <label
                                                        htmlFor={`ticket-quantity-${ticketType.id}`}
                                                        className="font-bold"
                                                    >
                                                        Quantidade
                                                    </label>
                                                    <input
                                                        id={`ticket-quantity-${ticketType.id}`}
                                                        type="number"
                                                        min="1"
                                                        required
                                                        value={ticketType.totalQuantity}
                                                        onChange={(event) =>
                                                            updateTicketType(
                                                                ticketType.id,
                                                                'totalQuantity',
                                                                event.target.value,
                                                            )
                                                        }
                                                        className="mt-2 w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 outline-none focus:border-t4u-primary"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </fieldset>

                            <button
                                type="submit"
                                disabled={isCreating || createdEvent?.status === 'PUBLICADO'}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-t4u-primary px-5 py-3 font-black text-t4u-primary hover:bg-t4u-primary hover:text-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isCreating ? (
                                    <>
                                        <LoaderCircle className="animate-spin" aria-hidden="true" />
                                        Criando rascunho...
                                    </>
                                ) : (
                                    <>
                                        <Send aria-hidden="true" />
                                        Criar evento em rascunho
                                    </>
                                )}
                            </button>
                        </form>

                        {createdEvent && (
                            <div
                                className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-950/30 p-5"
                                aria-live="polite"
                            >
                                <div className="flex items-start gap-3">
                                    <CheckCircle2
                                        className="shrink-0 text-emerald-300"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <p className="font-black">
                                            Evento criado: {createdEvent.status}
                                        </p>
                                        <p className="mt-1 text-sm text-stone-300">
                                            {createdEvent.title}
                                        </p>
                                    </div>
                                </div>

                                {createdEvent.status === 'RASCUNHO' && (
                                    <button
                                        type="button"
                                        onClick={publishEvent}
                                        disabled={isPublishing}
                                        className="mt-5 w-full rounded-xl bg-t4u-primary px-5 py-3 font-black text-stone-950 hover:bg-t4u-secondary disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {isPublishing
                                            ? 'Publicando...'
                                            : 'Publicar evento agora'}
                                    </button>
                                )}

                                {createdEvent.status === 'PUBLICADO' && (
                                    <Link
                                        to={`/events/${createdEvent.id}`}
                                        className="mt-5 inline-block font-bold text-t4u-primary hover:text-t4u-secondary"
                                    >
                                        Ver evento publicado →
                                    </Link>
                                )}
                            </div>
                        )}
                    </section>
                )}
            </div>
        </main>
    )
}