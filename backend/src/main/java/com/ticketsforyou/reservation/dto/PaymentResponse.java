package com.ticketsforyou.reservation.dto;

import com.ticketsforyou.reservation.enums.ReservationStatus;

import java.math.BigDecimal;
import java.util.UUID;

public record PaymentResponse(
        UUID reservationId,
        ReservationStatus status,
        BigDecimal totalAmount
) {
}