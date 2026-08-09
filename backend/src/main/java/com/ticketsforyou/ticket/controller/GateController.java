package com.ticketsforyou.ticket.controller;

import com.ticketsforyou.ticket.dto.TicketValidationResponse;
import com.ticketsforyou.ticket.dto.ValidateTicketRequest;
import com.ticketsforyou.ticket.service.TicketValidationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/gate")
@RequiredArgsConstructor
@Tag(name = "Portaria", description = "Validação de ingressos na entrada")
public class GateController {

    private final TicketValidationService ticketValidationService;

    @PostMapping("/validate-ticket")
    @Operation(summary = "Valida um ingresso por QR Code ou código digitado")
    public TicketValidationResponse validateTicket(
            @Valid @RequestBody ValidateTicketRequest request
    ) {
        return ticketValidationService.validate(request);
    }
}