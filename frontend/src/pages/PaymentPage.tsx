import { CheckCircle2, CreditCard, LoaderCircle, CircleX } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { apiFetch } from '../api/client'

export default function PaymentPage() {
    const { reservationId } = useParams()
    const navigate = useNavigate()
    const [isPaying, setIsPaying] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function simulatePayment(approved: boolean) {
        try {
            setIsPaying(true)
            setError(null)

            await apiFetch(`/reservations/${reservationId}/payment`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ approved }),
            })

            if (approved) {
                toast.success('Pagamento aprovado! Seus ingressos foram emitidos.')
                navigate('/tickets')
                return
            }

            toast.error('Pagamento recusado na simulação. Nenhum ingresso foi emitido.')
            navigate('/')
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Não foi possível processar o pagamento.'

            setError(message)
            toast.error(message)
        } finally {
            setIsPaying(false)
        }
    }

    return (
        <main className="grid min-h-screen place-items-center bg-stone-950 px-6 text-white">
            <section className="w-full max-w-lg rounded-3xl border border-white/10 bg-stone-900 p-8 shadow-2xl">
                <CreditCard size={42} className="text-t4u-primary" aria-hidden="true" />

                <p className="mt-6 font-bold text-t4u-primary">Pagamento simulado</p>
                <h1 className="mt-2 text-3xl font-black">Finalizar reserva</h1>

                <p className="mt-4 leading-7 text-stone-300">
                    Esta etapa simula a aprovação de um pagamento. Nenhuma cobrança real
                    será feita.
                </p>

                {error && (
                    <p role="alert" className="mt-5 rounded-lg bg-red-950/60 p-4 text-sm text-red-200">
                        {error}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => simulatePayment(true)}
                    disabled={isPaying}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPaying ? (
                        <>
                            <LoaderCircle className="animate-spin" aria-hidden="true" />
                            Processando...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 aria-hidden="true" />
                            Simular pagamento aprovado
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => simulatePayment(false)}
                    disabled={isPaying}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isPaying ? (
                        <>
                            <LoaderCircle className="animate-spin" aria-hidden="true" />
                            Processando...
                        </>
                    ) : (
                        <>
                            <CircleX aria-hidden="true" />
                            Simular pagamento negado
                        </>
                    )}
                </button>

                <Link
                    to="/"
                    className="mt-5 block text-center text-sm font-bold text-stone-300 hover:text-t4u-primary"
                >
                    Cancelar e voltar para eventos
                </Link>
            </section>
        </main>
    )
}