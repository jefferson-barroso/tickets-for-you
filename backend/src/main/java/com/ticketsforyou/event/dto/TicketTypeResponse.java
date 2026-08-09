package com.ticketsforyou.event.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record TicketTypeResponse(
        UUID id,
        String name,
        BigDecimal price,
        Integer availableQuantity
) {
}