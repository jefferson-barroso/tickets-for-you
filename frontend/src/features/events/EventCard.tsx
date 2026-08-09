import { CalendarDays, MapPin, Ticket } from 'lucide-react'

import type { EventSummary } from './types'
import { Link } from 'react-router-dom'

type EventCardProps = {
    event: EventSummary
}

export function EventCard({ event }: EventCardProps) {
    const date = new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(event.startsAt))

    const price = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(event.startingPrice)

    return (
        <article className="overflow-hidden rounded-2xl border border-white/10 bg-stone-900">
            <div className="aspect-[16/9] bg-gradient-to-br from-t4u-primary to-t4u-secondary">
                {event.posterUrl ? (
                    <img
                        src={event.posterUrl}
                        alt={`Pôster do evento ${event.title}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Ticket size={48} aria-hidden="true" className="text-stone-950" />
                    </div>
                )}
            </div>

            <div className="p-5">
                <p className="text-sm font-semibold text-t4u-primary">
                    {event.eventType === 'FILME' ? 'Cinema' : 'Show'}
                </p>

                <h3 className="mt-2 text-xl font-bold text-white">{event.title}</h3>

                <dl className="mt-4 space-y-2 text-sm text-stone-400">
                    <div className="flex gap-2">
                        <CalendarDays size={17} aria-hidden="true" className="shrink-0 text-t4u-primary" />
                        <dd>{date}</dd>
                    </div>

                    <div className="flex gap-2">
                        <MapPin size={17} aria-hidden="true" className="shrink-0 text-t4u-primary" />
                        <dd>{event.venueName}</dd>
                    </div>
                </dl>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <p className="text-sm text-stone-400">
                        A partir de{' '}
                        <strong className="text-base text-white">{price}</strong>
                    </p>


                        <Link
                            to={`/events/${event.id}`}
                            className="rounded-lg px-3 py-2 text-sm font-bold text-t4u-primary transition hover:bg-t4u-primary/10 focus:outline-none focus:ring-2 focus:ring-t4u-primary"
                        >
                            Ver evento
                        </Link>          
                </div>
            </div>
        </article>
    )
}