package com.ticketsforyou.ticket.dto;

import com.ticketsforyou.ticket.enums.TicketValidationStatus;

import java.time.OffsetDateTime;

public record TicketValidationResponse(
        TicketValidationStatus status,
        String message,
        String eventTitle,
        String ticketTypeName,
        OffsetDateTime checkedInAt
) {
}