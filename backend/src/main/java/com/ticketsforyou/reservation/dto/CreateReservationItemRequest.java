package com.ticketsforyou.reservation.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

public record CreateReservationItemRequest(
        @NotNull(message = "O setor é obrigatório")
        UUID ticketTypeId,

        @NotNull(message = "A quantidade é obrigatória")
        @Positive(message = "A quantidade deve ser maior que zero")
        Integer quantity
) {
}