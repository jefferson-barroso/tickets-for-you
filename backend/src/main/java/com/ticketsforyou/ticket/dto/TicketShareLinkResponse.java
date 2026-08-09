package com.ticketsforyou.ticket.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record TicketShareLinkResponse(
        UUID shareLinkId,
        String url,
        OffsetDateTime expiresAt
) {
}