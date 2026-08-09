package com.ticketsforyou.ticket.service;

import com.ticketsforyou.reservation.model.Reservation;
import com.ticketsforyou.reservation.model.ReservationItem;
import com.ticketsforyou.reservation.repository.ReservationItemRepository;
import com.ticketsforyou.ticket.enums.TicketStatus;
import com.ticketsforyou.ticket.model.Ticket;
import com.ticketsforyou.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketIssuanceService {

    private final ReservationItemRepository reservationItemRepository;
    private final TicketRepository ticketRepository;
    private final TicketQrService ticketQrService;

    public void issueTickets(Reservation reservation) {
        List<ReservationItem> reservationItems = reservationItemRepository
                .findByReservationId(reservation.getId());

        List<Ticket> tickets = new ArrayList<>();

        for (ReservationItem reservationItem : reservationItems) {
            for (int index = 0; index < reservationItem.getQuantity(); index++) {
                UUID ticketCode = UUID.randomUUID();
                String qrPayload = ticketQrService.generatePayload(ticketCode);

                Ticket ticket = new Ticket();
                ticket.setReservationItem(reservationItem);
                ticket.setEvent(reservation.getEvent());
                ticket.setCustomer(reservation.getCustomer());
                ticket.setTicketCode(ticketCode);
                ticket.setQrTokenHash(ticketQrService.hashPayload(qrPayload));
                ticket.setStatus(TicketStatus.EMITIDO);

                tickets.add(ticket);
            }
        }

        ticketRepository.saveAll(tickets);
    }
}