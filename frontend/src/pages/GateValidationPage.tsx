import {
  CheckCircle2,
  CircleX,
  ClipboardCheck,
  LoaderCircle,
  ScanLine, Camera,
  CameraOff,
} from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Scanner } from '@yudiel/react-qr-scanner'
import { toast } from 'sonner'

import { apiFetch } from '../api/client'

type EventOption = {
  id: string
  title: string
}

type ValidationResponse = {
  status: 'VALIDO' | 'INVALIDO' | 'JA_UTILIZADO' | 'EVENTO_INCORRETO' | 'CANCELADO'
  message: string
  eventTitle: string | null
  ticketTypeName: string | null
  checkedInAt: string | null
}

export default function GateValidationPage() {
  const [events, setEvents] = useState<EventOption[]>([])
  const [eventId, setEventId] = useState('')
  const [qrPayload, setQrPayload] = useState('')
  const [result, setResult] = useState<ValidationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [scannerError, setScannerError] = useState<string | null>(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await apiFetch<EventOption[]>('/events')
        setEvents(response)

        if (response.length > 0) {
          setEventId(response[0].id)
        }
      } catch {
        setError('Não foi possível carregar os eventos.')
      }
    }

    loadEvents()
  }, [])

  function handleScan(codes: { rawValue: string }[]) {
    const scannedValue = codes[0]?.rawValue

    if (!scannedValue) return

    setQrPayload(scannedValue)
    setIsScannerOpen(false)
    setScannerError(null)
  }

  async function validateTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setIsLoading(true)
      setError(null)
      setResult(null)

      const response = await apiFetch<ValidationResponse>(
        '/gate/validate-ticket',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId, qrPayload }),
        },
      )

      setResult(response)
      if (response.status === 'VALIDO') {
        toast.success('Entrada autorizada e registrada.')
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Não foi possível validar o ingresso.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const isValid = result?.status === 'VALIDO'

  return (
    <main className="min-h-screen bg-stone-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="font-bold text-t4u-primary hover:text-t4u-secondary"
        >
          ← Voltar para eventos
        </Link>

        <header className="mt-8">
          <p className="font-bold text-t4u-primary">Área de portaria</p>
          <h1 className="mt-2 text-4xl font-black">Validar ingresso</h1>
          <p className="mt-3 text-stone-300">
            Selecione o evento e informe o conteúdo do QR Code do ingresso.
          </p>
        </header>

        <form
          onSubmit={validateTicket}
          className="mt-8 rounded-3xl border border-white/10 bg-stone-900 p-6 sm:p-8"
        >
          <label htmlFor="event" className="font-bold">
            Evento
          </label>
          <select
            id="event"
            value={eventId}
            onChange={(event) => setEventId(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border border-white/15 bg-stone-950 px-4 py-3 text-white outline-none focus:border-t4u-primary"
          >
            <option value="">Selecione um evento</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>

          <label htmlFor="qrPayload" className="mt-6 block font-bold">
            Conteúdo do QR Code
          </label>
          <textarea
            id="qrPayload"
            value={qrPayload}
            onChange={(event) => setQrPayload(event.target.value)}
            required
            rows={6}
            placeholder="Cole aqui o conteúdo completo lido no QR Code"
            className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-stone-950 px-4 py-3 text-sm text-white outline-none placeholder:text-stone-500 focus:border-t4u-primary"
          />

          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                setIsScannerOpen((current) => !current)
                setScannerError(null)
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-t4u-primary/60 px-4 py-3 font-bold text-t4u-primary hover:bg-t4u-primary hover:text-stone-950"
            >
              {isScannerOpen ? (
                <>
                  <CameraOff size={19} aria-hidden="true" />
                  Fechar câmera
                </>
              ) : (
                <>
                  <Camera size={19} aria-hidden="true" />
                  Ler QR Code pela câmera
                </>
              )}
            </button>

            {isScannerOpen && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-t4u-primary/40 bg-black">
                <Scanner
                  onScan={handleScan}
                  onError={(error) =>
                    setScannerError(
                      error.message || 'Não foi possível acessar a câmera.',
                    )
                  }
                  formats={['qr_code']}
                  constraints={{
                    facingMode: 'environment',
                  }}
                  components={{
                    finder: true,
                    onOff: true,
                    torch: true,
                  }}
                />

                <p className="border-t border-white/10 p-3 text-center text-sm text-stone-300">
                  Posicione o QR Code dentro da área destacada.
                </p>
              </div>
            )}

            {scannerError && (
              <p role="alert" className="mt-3 text-sm text-red-300">
                {scannerError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !eventId || !qrPayload.trim()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-t4u-primary px-5 py-3 font-black text-stone-950 hover:bg-t4u-secondary disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="animate-spin" aria-hidden="true" />
                Validando...
              </>
            ) : (
              <>
                <ScanLine aria-hidden="true" />
                Validar ingresso
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

        {result && (
          <section
            aria-live="polite"
            className={`mt-6 rounded-3xl border p-6 ${isValid
              ? 'border-emerald-400/40 bg-emerald-950/40'
              : 'border-red-400/40 bg-red-950/40'
              }`}
          >
            <div className="flex items-center gap-3">
              {isValid ? (
                <CheckCircle2 className="text-emerald-300" size={34} aria-hidden="true" />
              ) : (
                <CircleX className="text-red-300" size={34} aria-hidden="true" />
              )}

              <div>
                <p className="font-black">{result.status.replaceAll('_', ' ')}</p>
                <p className="text-sm text-stone-200">{result.message}</p>
              </div>
            </div>

            {result.eventTitle && (
              <div className="mt-5 border-t border-white/15 pt-4 text-sm text-stone-200">
                <p>
                  <strong>Evento:</strong> {result.eventTitle}
                </p>
                <p className="mt-1">
                  <strong>Ingresso:</strong> {result.ticketTypeName}
                </p>
                {result.checkedInAt && (
                  <p className="mt-1">
                    <strong>Entrada registrada:</strong>{' '}
                    {new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    }).format(new Date(result.checkedInAt))}
                  </p>
                )}
              </div>
            )}
          </section>
        )}

        <p className="mt-6 flex items-center gap-2 text-sm text-stone-400">
          <ClipboardCheck size={17} aria-hidden="true" />
          Uma validação aprovada registra a entrada e o ingresso não poderá ser
          utilizado novamente.
        </p>
      </div>
    </main>
  )
}