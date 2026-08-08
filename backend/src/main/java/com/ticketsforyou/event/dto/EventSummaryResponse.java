package com.ticketsforyou.event.dto;



import com.ticketsforyou.event.enums.EventStatus;
import com.ticketsforyou.event.enums.EventType;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record EventSummaryResponse(
        UUID id,
        String title,
        EventType eventType,
        OffsetDateTime startsAt,
        String venueName,
        String venueAddress,
        String posterUrl,
        BigDecimal startingPrice,
        EventStatus status
) {
}