package com.ticketsforyou.ticket.dto;

import com.ticketsforyou.ticket.enums.TicketStatus;

import java.time.OffsetDateTime;
import java.util.UUID;

public record MyTicketResponse(
        UUID id,
        UUID ticketCode,
        String eventTitle,
        OffsetDateTime eventStartsAt,
        String venueName,
        String ticketTypeName,
        TicketStatus status,
        String qrPayload
) {
}