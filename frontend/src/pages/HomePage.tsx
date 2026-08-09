import {
    ArrowRight,
    CalendarDays,
    LogOut,
    ScanLine,
    Search,
    ShieldCheck,
    Ticket,
    UserRound,
} from 'lucide-react'
import { EventCard } from '../features/events/EventCard'
import { usePublishedEvents } from '../features/events/usePublishedEvents'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

function HomePage() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate('/')
    }
    const { events, isLoading, error } = usePublishedEvents()
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

                    <nav aria-label="Navegação principal" className="hidden md:block">
                        <ul className="flex items-center gap-7 text-sm font-medium text-stone-300">
                            <li>
                                <a className="transition hover:text-t4u-primary" href="#eventos">
                                    Eventos
                                </a>
                            </li>
                            <li>
                                <a className="transition hover:text-t4u-primary" href="#como-funciona">
                                    Como funciona
                                </a>
                            </li>
                            <li>
                                <a className="transition hover:text-t4u-primary" href="#seguranca">
                                    Segurança
                                </a>
                            </li>
                        </ul>
                    </nav>

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
                                <Ticket size={17} aria-hidden="true" />
                                Seu próximo momento começa aqui
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

                        <div className="rounded-3xl border border-t4u-primary/30 bg-gradient-to-br from-t4u-primary via-[#ffb94a] to-t4u-secondary p-8 text-stone-950 shadow-2xl shadow-black/30">
                            <div className="flex items-center justify-between border-b border-stone-950/15 pb-5">
                                <span className="font-black tracking-[0.2em]">T4U PASS</span>
                                <Ticket size={26} aria-hidden="true" />
                            </div>

                            <p className="mt-10 text-sm font-semibold uppercase tracking-[0.2em] text-stone-700">
                                Experiências ao vivo
                            </p>

                            <p className="mt-2 text-3xl font-black leading-tight">
                                O seu ingresso.
                                <br />
                                Do seu jeito.
                            </p>

                            <div className="mt-12 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-stone-700">Reserva segura</p>
                                    <p className="mt-1 font-bold">Estoque protegido</p>
                                </div>
                                <div>
                                    <p className="text-stone-700">Entrada rápida</p>
                                    <p className="mt-1 font-bold">QR Code validado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="como-funciona" className="bg-stone-900/70 py-20">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="max-w-2xl">
                            <p className="font-semibold text-t4u-primary">SIMPLIFICAMOS A JORNADA</p>
                            <h2 className="mt-3 text-3xl font-black text-white">
                                Da descoberta à entrada, sem complicação.
                            </h2>
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-3">
                            <article className="rounded-2xl border border-white/10 bg-stone-950 p-6">
                                <Search className="text-t4u-primary" aria-hidden="true" />
                                <h3 className="mt-5 text-xl font-bold">Descubra</h3>
                                <p className="mt-2 leading-7 text-stone-400">
                                    Encontre eventos, confira local, data, setores e valores.
                                </p>
                            </article>

                            <article className="rounded-2xl border border-white/10 bg-stone-950 p-6">
                                <CalendarDays className="text-t4u-primary" aria-hidden="true" />
                                <h3 className="mt-5 text-xl font-bold">Reserve</h3>
                                <p className="mt-2 leading-7 text-stone-400">
                                    Selecione seus ingressos com estoque atualizado e pagamento simulado.
                                </p>
                            </article>

                            <article id="seguranca" className="rounded-2xl border border-white/10 bg-stone-950 p-6">
                                <ShieldCheck className="text-t4u-primary" aria-hidden="true" />
                                <h3 className="mt-5 text-xl font-bold">Aproveite</h3>
                                <p className="mt-2 leading-7 text-stone-400">
                                    Acesse seu ingresso digital e entre com QR Code seguro.
                                </p>
                            </article>
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

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
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