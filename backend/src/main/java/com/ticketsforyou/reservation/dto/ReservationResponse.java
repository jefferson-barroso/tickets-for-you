package com.ticketsforyou.reservation.dto;

import com.ticketsforyou.reservation.enums.ReservationStatus;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record ReservationResponse(
        UUID id,
        UUID eventId,
        ReservationStatus status,
        BigDecimal totalAmount,
        OffsetDateTime expiresAt
) {
}