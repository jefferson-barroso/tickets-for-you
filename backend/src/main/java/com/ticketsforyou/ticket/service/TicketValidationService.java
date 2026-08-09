package com.ticketsforyou.ticket.service;

import com.ticketsforyou.auth.service.JwtService;
import com.ticketsforyou.ticket.dto.TicketValidationResponse;
import com.ticketsforyou.ticket.dto.ValidateTicketRequest;
import com.ticketsforyou.ticket.enums.TicketStatus;
import com.ticketsforyou.ticket.enums.TicketValidationStatus;
import com.ticketsforyou.ticket.model.Ticket;
import com.ticketsforyou.ticket.repository.TicketRepository;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketValidationService {

    private final JwtService jwtService;
    private final TicketQrService ticketQrService;
    private final TicketRepository ticketRepository;

    @Transactional
    public TicketValidationResponse validate(ValidateTicketRequest request) {
        try {
            UUID ticketCode = jwtService.extractTicketCode(request.qrPayload());

            Ticket ticket = ticketRepository.findByTicketCodeForUpdate(ticketCode)
                    .orElse(null);

            if (ticket == null || !ticket.getQrTokenHash().equals(
                    ticketQrService.hashPayload(request.qrPayload())
            )) {
                return response(
                        TicketValidationStatus.INVALIDO,
                        "Ingresso inválido ou adulterado",
                        null
                );
            }

            if (!ticket.getEvent().getId().equals(request.eventId())) {
                return response(
                        TicketValidationStatus.EVENTO_INCORRETO,
                        "Este ingresso pertence a outro evento",
                        ticket
                );
            }

            if (ticket.getStatus() == TicketStatus.UTILIZADO) {
                return response(
                        TicketValidationStatus.JA_UTILIZADO,
                        "Este ingresso já foi utilizado",
                        ticket
                );
            }

            if (ticket.getStatus() == TicketStatus.CANCELADO) {
                return response(
                        TicketValidationStatus.CANCELADO,
                        "Este ingresso foi cancelado",
                        ticket
                );
            }

            ticket.setStatus(TicketStatus.UTILIZADO);
            ticket.setCheckedInAt(OffsetDateTime.now());

            return response(
                    TicketValidationStatus.VALIDO,
                    "Entrada liberada",
                    ticket
            );
        } catch (JwtException | IllegalArgumentException exception) {
            return response(
                    TicketValidationStatus.INVALIDO,
                    "Código QR inválido",
                    null
            );
        }
    }

    private TicketValidationResponse response(
            TicketValidationStatus status,
            String message,
            Ticket ticket
    ) {
        if (ticket == null) {
            return new TicketValidationResponse(
                    status, message, null, null, null
            );
        }

        return new TicketValidationResponse(
                status,
                message,
                ticket.getEvent().getTitle(),
                ticket.getReservationItem().getTicketType().getName(),
                ticket.getCheckedInAt()
        );
    }
}