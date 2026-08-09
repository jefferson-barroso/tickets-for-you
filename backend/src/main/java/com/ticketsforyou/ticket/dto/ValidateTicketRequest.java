package com.ticketsforyou.ticket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ValidateTicketRequest(
        @NotNull(message = "O evento é obrigatório")
        UUID eventId,

        @NotBlank(message = "Informe ou leia o código QR")
        String qrPayload
) {
}