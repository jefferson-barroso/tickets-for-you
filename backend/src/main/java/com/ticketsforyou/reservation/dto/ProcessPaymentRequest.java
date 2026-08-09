package com.ticketsforyou.reservation.dto;

import jakarta.validation.constraints.NotNull;

public record ProcessPaymentRequest(
        @NotNull(message = "Informe o resultado simulado do pagamento")
        Boolean approved
) {
}