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

export type CreateReservationRequest = {
  items: {
    ticketTypeId: string;
    quantity: number;
  }[];
};

export type ReservationResponse = {
  id: string;
  status: string;
  totalAmount: number;
  expiresAt: string;
};