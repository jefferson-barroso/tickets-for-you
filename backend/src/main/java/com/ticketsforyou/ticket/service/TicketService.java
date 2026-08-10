package com.ticketsforyou.ticket.service;

import com.ticketsforyou.ticket.dto.MyTicketResponse;
import com.ticketsforyou.ticket.model.Ticket;
import com.ticketsforyou.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ticketsforyou.event.model.TicketType;
import com.ticketsforyou.event.repository.TicketTypeRepository;
import com.ticketsforyou.ticket.enums.TicketStatus;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketQrService ticketQrService;
    private final TicketTypeRepository ticketTypeRepository;

    @Transactional(readOnly = true)
    public List<MyTicketResponse> listMyTickets(String customerEmail) {
        return ticketRepository.findMyTickets(customerEmail)
                .stream()
                .map(ticket -> new MyTicketResponse(
                        ticket.getId(),
                        ticket.getTicketCode(),
                        ticket.getEvent().getTitle(),
                        ticket.getEvent().getStartsAt(),
                        ticket.getEvent().getVenueName(),
                        ticket.getReservationItem().getTicketType().getName(),
                        ticket.getStatus(),
                        ticketQrService.generatePayload(ticket.getTicketCode())
                ))
                .toList();
    }

    @Transactional
    public MyTicketResponse cancelTicket(
            UUID ticketId,
            String customerEmail
    ) {
        Ticket ticket = ticketRepository
                .findByIdAndCustomerEmailForUpdate(ticketId, customerEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ingresso não encontrado"
                ));

        if (ticket.getStatus() != TicketStatus.EMITIDO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Somente ingressos emitidos podem ser cancelados"
            );
        }

        TicketType ticketType = ticketTypeRepository
                .findByIdForUpdate(ticket.getReservationItem().getTicketType().getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tipo de ingresso não encontrado"
                ));

        ticket.setStatus(TicketStatus.CANCELADO);

        ticketType.setAvailableQuantity(
                ticketType.getAvailableQuantity() + 1
        );

        return new MyTicketResponse(
                ticket.getId(),
                ticket.getTicketCode(),
                ticket.getEvent().getTitle(),
                ticket.getEvent().getStartsAt(),
                ticket.getEvent().getVenueName(),
                ticketType.getName(),
                ticket.getStatus(),
                ticketQrService.generatePayload(ticket.getTicketCode())
        );
    }
}