export type EventSummary = {
  id: string
  title: string
  eventType: 'SHOW' | 'FILME'
  startsAt: string
  venueName: string
  venueAddress: string
  posterUrl: string | null
  startingPrice: number
  status: 'PUBLICADO'
}