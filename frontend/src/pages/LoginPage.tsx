import { LogIn, Ticket } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuth } from '../features/auth/AuthContext'

export default function LoginPage() {
    const { login } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            await login(email, password)
            toast.success('Login realizado com sucesso.')
            navigate('/')
        } catch {
            setError('E-mail ou senha inválidos.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <main className="grid min-h-screen place-items-center bg-stone-950 px-6 text-white">
            <section
                className="w-full max-w-md rounded-3xl border border-white/10 bg-stone-900 p-8 shadow-2xl"
                aria-labelledby="login-title"
            >
                <div className='text-center -mb-4 '>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-bold text-t4u-primary"
                    >
                        <Ticket size={18} aria-hidden="true" />
                        TicketsForYou
                        <Ticket size={18} aria-hidden="true" />

                    </Link>
                </div>

                <div className='flex justify-center -mb-4'>
                    <Link
                        to="/"
                    >
                        <img
                            src="/logo.png"
                            alt="TicketsForYou"
                            className="h-40 w-50"
                        />
                    </Link>
                </div>

                <h1 id="login-title" className="mt-8 text-3xl font-black text-center">
                    Bem-vindo de volta
                </h1>

                <p className="mt-2 text-stone-400 text-center">
                    Entre para acessar seus ingressos e recursos da plataforma.
                </p>

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="mb-2 block font-semibold">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 text-white placeholder:text-stone-500"
                            placeholder="voce@email.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-2 block font-semibold">
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 text-white placeholder:text-stone-500"
                            placeholder="Sua senha"
                        />
                    </div>

                    {error && (
                        <p
                            className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-t4u-primary px-5 py-3 font-bold text-stone-950 transition hover:bg-t4u-secondary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <LogIn size={18} aria-hidden="true" />
                        {isLoading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </section>
        </main>
    )
}