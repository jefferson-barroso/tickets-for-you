package com.ticketsforyou.reservation.controller;

import com.ticketsforyou.reservation.dto.CreateReservationRequest;
import com.ticketsforyou.reservation.dto.ReservationResponse;
import com.ticketsforyou.reservation.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.ticketsforyou.reservation.dto.PaymentResponse;
import com.ticketsforyou.reservation.dto.ProcessPaymentRequest;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
@Tag(name = "Reservas", description = "Reserva de ingressos por setor")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Reserva ingressos e reduz o estoque disponível")
    public ReservationResponse createReservation(
            @Valid @RequestBody CreateReservationRequest request,
            Authentication authentication
    ) {
        return reservationService.createReservation(
                authentication.getName(),
                request
        );
    }

    @PatchMapping("/{reservationId}/payment")
    @Operation(summary = "Processa um pagamento simulado")
    public PaymentResponse processPayment(
            @PathVariable UUID reservationId,
            @Valid @RequestBody ProcessPaymentRequest request,
            Authentication authentication
    ) {
        return reservationService.processPayment(
                reservationId,
                authentication.getName(),
                request
        );
    }
}