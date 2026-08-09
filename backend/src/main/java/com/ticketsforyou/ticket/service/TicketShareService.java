package com.ticketsforyou.ticket.service;

import com.ticketsforyou.ticket.dto.SharedTicketResponse;
import com.ticketsforyou.ticket.dto.TicketShareLinkResponse;
import com.ticketsforyou.ticket.model.Ticket;
import com.ticketsforyou.ticket.model.TicketShareLink;
import com.ticketsforyou.ticket.repository.TicketRepository;
import com.ticketsforyou.ticket.repository.TicketShareLinkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketShareService {

    private final TicketRepository ticketRepository;
    private final TicketShareLinkRepository ticketShareLinkRepository;
    private final TicketQrService ticketQrService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Transactional
    public TicketShareLinkResponse createShareLink(
            UUID ticketId,
            String customerEmail
    ) {
        Ticket ticket = ticketRepository
                .findByIdAndCustomerEmail(ticketId, customerEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Ingresso não encontrado"
                ));

        String rawToken = UUID.randomUUID().toString();

        TicketShareLink shareLink = new TicketShareLink();
        shareLink.setTicket(ticket);
        shareLink.setTokenHash(ticketQrService.hashPayload(rawToken));
        shareLink.setExpiresAt(OffsetDateTime.now().plusHours(48));

        TicketShareLink savedLink = ticketShareLinkRepository.save(shareLink);

        return new TicketShareLinkResponse(
                savedLink.getId(),
                frontendUrl + "/tickets/shared/" + rawToken,
                savedLink.getExpiresAt()
        );
    }

    @Transactional(readOnly = true)
    public SharedTicketResponse getSharedTicket(String rawToken) {
        TicketShareLink shareLink = ticketShareLinkRepository
                .findByTokenHashAndRevokedAtIsNull(
                        ticketQrService.hashPayload(rawToken)
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Link de compartilhamento inválido"
                ));

        if (
                shareLink.getExpiresAt() != null &&
                        shareLink.getExpiresAt().isBefore(OffsetDateTime.now())
        ) {
            throw new ResponseStatusException(
                    HttpStatus.GONE,
                    "Este link de compartilhamento expirou"
            );
        }

        Ticket ticket = shareLink.getTicket();

        return new SharedTicketResponse(
                ticket.getEvent().getTitle(),
                ticket.getEvent().getStartsAt(),
                ticket.getEvent().getVenueName(),
                ticket.getReservationItem().getTicketType().getName(),
                ticket.getStatus(),
                ticketQrService.generatePayload(ticket.getTicketCode())
        );
    }
}