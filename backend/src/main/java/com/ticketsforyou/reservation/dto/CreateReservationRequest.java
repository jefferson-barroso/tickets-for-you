package com.ticketsforyou.reservation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record CreateReservationRequest(
        @NotNull(message = "O evento é obrigatório")
        UUID eventId,

        @NotEmpty(message = "Selecione ao menos um setor")
        List<@Valid CreateReservationItemRequest> items
) {
}