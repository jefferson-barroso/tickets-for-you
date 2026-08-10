import {
    ArrowRight,
    CalendarDays,
    LogOut,
    ScanLine,
    Search,
    ShieldCheck,
    UserRound,
    SlidersHorizontal,
    X,
} from 'lucide-react'
import { EventCard } from '../features/events/EventCard'
import { usePublishedEvents } from '../features/events/usePublishedEvents'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { useMemo, useState } from 'react'
import { FeaturedEventsCarousel } from '../features/events/FeaturedEventsCarousel'

function HomePage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/')
    }
    const { events, isLoading, error } = usePublishedEvents()
    const [searchQuery, setSearchQuery] = useState('')
    const [eventTypeFilter, setEventTypeFilter] = useState('TODOS')
    const [dateFilter, setDateFilter] = useState('')

    const filteredEvents = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase('pt-BR')

        return events.filter((event) => {
            const matchesSearch =
                !normalizedQuery ||
                event.title.toLocaleLowerCase('pt-BR').includes(normalizedQuery) ||
                event.venueName.toLocaleLowerCase('pt-BR').includes(normalizedQuery) ||
                event.venueAddress.toLocaleLowerCase('pt-BR').includes(normalizedQuery)

            const matchesType =
                eventTypeFilter === 'TODOS' ||
                event.eventType === eventTypeFilter

            const eventDate = new Intl.DateTimeFormat('en-CA', {
                timeZone: 'America/Sao_Paulo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }).format(new Date(event.startsAt))

            const matchesDate = !dateFilter || eventDate === dateFilter

            return matchesSearch && matchesType && matchesDate
        })
    }, [events, searchQuery, eventTypeFilter, dateFilter])

    function clearFilters() {
        setSearchQuery('')
        setEventTypeFilter('TODOS')
        setDateFilter('')
    }

    const hasActiveFilters =
        searchQuery.trim() !== '' ||
        eventTypeFilter !== 'TODOS' ||
        dateFilter !== ''
    return (
        <div className="min-h-screen bg-stone-950 text-stone-100">
            <a
                href="#conteudo-principal"
                className="sr-only fixed left-4 top-4 z-50 rounded-lg bg-t4u-primary px-4 py-2 font-bold text-stone-950 focus:not-sr-only"
            >
                Pular para o conteúdo principal
            </a>

            <header className="border-b border-white/10 bg-stone-950/90 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <a
                        href="/"
                        className="flex items-center gap-3"
                        aria-label="TicketsForYou - página inicial"
                    >
                        <img
                            src="/logo.png"
                            alt="TicketsForYou"
                            className="h-16 w-auto object-contain sm:h-20"
                        />
                    </a>


                    {user ? (
                        <div className="flex items-center gap-3">
                            {user.role === 'CLIENTE' && (
                                <Link
                                    to="/tickets"
                                    className="inline-flex items-center gap-2 rounded-full border border-t4u-primary/70 px-4 py-2 text-sm font-semibold text-t4u-primary transition hover:bg-t4u-primary hover:text-stone-950"
                                >
                                    <UserRound size={17} aria-hidden="true" />
                                    Meus ingressos
                                </Link>
                            )}

                            {user.role === 'PORTARIA' && (
                                <Link
                                    to="/gate"
                                    className="inline-flex items-center gap-2 rounded-full border border-t4u-primary/70 px-4 py-2 text-sm font-semibold text-t4u-primary transition hover:bg-t4u-primary hover:text-stone-950"
                                >
                                    <ScanLine size={17} aria-hidden="true" />
                                    Portaria
                                </Link>
                            )}

                            {user.role === 'ORGANIZADOR' && (
                                <Link
                                    to="/organizer"
                                    className="inline-flex items-center gap-2 rounded-full border border-t4u-primary/70 px-4 py-2 text-sm font-semibold text-t4u-primary transition hover:bg-t4u-primary hover:text-stone-950"
                                >
                                    <UserRound size={17} aria-hidden="true" />
                                    Organizar eventos
                                </Link>
                            )}

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 rounded-full bg-t4u-primary px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-t4u-secondary"
                            >
                                <LogOut size={17} aria-hidden="true" />
                                Sair
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded-full border border-t4u-primary/70 px-4 py-2 text-sm font-semibold text-t4u-secondary transition hover:bg-t4u-primary hover:text-stone-950 focus:outline-none focus:ring-2 focus:ring-t4u-primary focus:ring-offset-2 focus:ring-offset-stone-950"
                        >
                            Entrar
                        </Link>
                    )}
                </div>
            </header>

            <main id="conteudo-principal">
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(251,191,36,0.22),transparent_27%),radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.18),transparent_23%)]" />

                    <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
                        <div>
                            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-t4u-primary/30 bg-t4u-primary/10 px-4 py-2 text-sm font-medium text-t4u-secondary">
                                Seu próximo momento começa aqui!
                            </p>

                            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Encontre o seu lugar na próxima{' '}
                                <span className="text-t4u-primary">história.</span>
                            </h1>

                            <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
                                Shows, cinema e experiências para viver de perto. Escolha seu
                                evento, reserve com segurança e leve seu ingresso sempre com você.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <a
                                    href="#eventos"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-t4u-primary px-5 py-3 font-bold text-stone-950 transition hover:bg-t4u-secondary focus:outline-none focus:ring-2 focus:ring-t4u-primary focus:ring-offset-2 focus:ring-offset-stone-950"
                                >
                                    Explorar eventos
                                    <ArrowRight size={18} aria-hidden="true" />
                                </a>

                                <a
                                    href="#como-funciona"
                                    className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 font-bold text-white transition hover:border-t4u-primary/70 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-t4u-primary focus:ring-offset-2 focus:ring-offset-stone-950"
                                >
                                    Como comprar
                                </a>
                            </div>
                        </div>
                        <div>
                            <FeaturedEventsCarousel events={events.slice(0, 5)} />

                        </div>
                    </div>
                </section>

                <section id="como-funciona" className="bg-stone-900/70 py-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="max-w-2xl">
                            <p className="font-semibold text-t4u-primary">SIMPLIFICAMOS A JORNADA, ENTENDA:</p>
                            <h2 className="mt-3 text-3xl font-black text-white">
                                Da descoberta à entrada, sem complicação.
                            </h2>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            <a href="#eventos">
                                <article className="rounded-2xl border border-white/10 bg-stone-950 p-6 transform transition duration-300 hover:scale-105">
                                    <Search className="text-t4u-primary" aria-hidden="true" />
                                    <h3 className="mt-5 text-xl font-bold">Descubra</h3>
                                    <p className="mt-2 leading-7 text-stone-400">
                                        Encontre eventos, confira local, data, setores e valores.
                                    </p>
                                </article>
                            </a>
                            <a href="#eventos">
                                <article className="rounded-2xl border border-white/10 bg-stone-950 p-6 transform transition duration-300 hover:scale-105">
                                    <CalendarDays className="text-t4u-primary" aria-hidden="true" />
                                    <h3 className="mt-5 text-xl font-bold">Reserve</h3>
                                    <p className="mt-2 leading-7 text-stone-400">
                                        Selecione seus ingressos com estoque atualizado e pagamento simulado.
                                    </p>
                                </article>
                            </a>
                            <a href="#eventos">
                                <article id="seguranca" className="rounded-2xl border border-white/10 bg-stone-950 p-6 transform transition duration-300 hover:scale-105">
                                    <ShieldCheck className="text-t4u-primary" aria-hidden="true" />
                                    <h3 className="mt-5 text-xl font-bold">Aproveite</h3>
                                    <p className="mt-2 leading-7 text-stone-400">
                                        Acesse seu ingresso digital e entre com QR Code seguro.
                                    </p>
                                </article>
                            </a>
                        </div>
                    </div>
                </section>

                <section id="eventos" className="mx-auto max-w-7xl px-6 py-20">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <p className="font-semibold text-t4u-primary">EM CARTAZ</p>
                            <h2 className="mt-2 text-3xl font-black text-white">
                                Eventos em destaque
                            </h2>
                        </div>

                        <p className="max-w-md text-stone-400">
                            Escolha sua próxima experiência e garanta seu lugar.
                        </p>
                    </div>

                    <section
                        aria-label="Filtros de eventos"
                        className="mt-8 rounded-2xl border border-white/10 bg-stone-900 p-4 sm:p-5"
                    >
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal
                                size={19}
                                className="text-t4u-primary"
                                aria-hidden="true"
                            />
                            <h3 className="font-black">Encontre seu evento</h3>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-[1.5fr_0.75fr_0.75fr_auto]">
                            <div className="relative">
                                <label htmlFor="event-search" className="sr-only">
                                    Buscar por evento ou local
                                </label>
                                <Search
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-t4u-primary"
                                    aria-hidden="true"
                                    color='white'
                                />
                                <input
                                    id="event-search"
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) =>
                                        setSearchQuery(event.target.value)
                                    }
                                    placeholder="Buscar evento ou local"
                                    className="w-full rounded-xl border border-white/15 bg-stone-950 py-3 pl-11 pr-4 text-white outline-none placeholder:text-stone-500 focus:border-t4u-primary"
                                />
                            </div>

                            <div>
                                <label htmlFor="event-type" className="sr-only">
                                    Tipo de evento
                                </label>
                                <select
                                    id="event-type"
                                    value={eventTypeFilter}
                                    onChange={(event) =>
                                        setEventTypeFilter(event.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 text-white outline-none focus:border-t4u-primary"
                                >
                                    <option value="TODOS">Todos os tipos</option>
                                    <option value="SHOW">Shows</option>
                                    <option value="FILME">Cinema</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="event-date" className="sr-only">
                                    Data do evento
                                </label>
                                <input
                                    id="event-date"
                                    type="date"
                                    value={dateFilter}
                                    onChange={(event) =>
                                        setDateFilter(event.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 text-white outline-none focus:border-t4u-primary [&::-webkit-calendar-picker-indicator]:invert" />
                            </div>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-stone-200 hover:border-t4u-primary hover:text-t4u-primary"
                                >
                                    <X size={17} aria-hidden="true" />
                                    Limpar
                                </button>
                            )}
                        </div>

                        <p aria-live="polite" className="mt-4 text-sm text-stone-400">
                            {filteredEvents.length === 1
                                ? '1 evento encontrado'
                                : `${filteredEvents.length} eventos encontrados`}
                        </p>
                    </section>

                    {isLoading && (
                        <p className="mt-10 text-stone-400" role="status">
                            Carregando eventos...
                        </p>
                    )}

                    {error && (
                        <p className="mt-10 rounded-xl border border-red-400/30 bg-red-400/10 p-4 text-red-200" role="alert">
                            {error}
                        </p>
                    )}

                    {!isLoading && !error && events.length === 0 && (
                        <p className="mt-10 text-stone-400">
                            Nenhum evento publicado no momento.
                        </p>
                    )}
                    {!isLoading &&
                        !error &&
                        events.length > 0 &&
                        filteredEvents.length === 0 && (
                            <div className="mt-10 rounded-2xl border border-dashed border-white/20 p-8 text-center">
                                <p className="font-bold text-white">
                                    Nenhum evento corresponde aos filtros.
                                </p>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-3 font-bold text-t4u-primary hover:text-t4u-secondary"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        )}

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-stone-500">
                <p>TicketsForYou (T4U)  | Desenvolvido por Jefferson Barroso Freitas</p>
            </footer>
        </div>
    )
}

export default HomePage