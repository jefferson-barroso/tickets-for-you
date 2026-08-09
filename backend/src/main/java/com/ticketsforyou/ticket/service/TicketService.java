package com.ticketsforyou.ticket.service;

import com.ticketsforyou.ticket.dto.MyTicketResponse;
import com.ticketsforyou.ticket.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final TicketQrService ticketQrService;

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
}