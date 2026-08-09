package com.ticketsforyou.event.dto;

import com.ticketsforyou.event.enums.EventType;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record EventDetailResponse(
        UUID id,
        String title,
        String description,
        EventType eventType,
        OffsetDateTime startsAt,
        String venueName,
        String venueAddress,
        String posterUrl,
        List<TicketTypeResponse> ticketTypes
) {
}