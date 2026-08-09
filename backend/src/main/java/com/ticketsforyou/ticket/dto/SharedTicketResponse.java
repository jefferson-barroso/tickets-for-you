package com.ticketsforyou.ticket.dto;

import com.ticketsforyou.ticket.enums.TicketStatus;

import java.time.OffsetDateTime;

public record SharedTicketResponse(
        String eventTitle,
        OffsetDateTime eventStartsAt,
        String venueName,
        String ticketTypeName,
        TicketStatus status,
        String qrPayload
) {
}