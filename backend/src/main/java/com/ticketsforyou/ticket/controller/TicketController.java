package com.ticketsforyou.ticket.controller;

import com.ticketsforyou.ticket.dto.MyTicketResponse;
import com.ticketsforyou.ticket.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
@Tag(name = "Ingressos", description = "Ingressos emitidos após pagamentos aprovados")
public class TicketController {

    private final TicketService ticketService;

    @GetMapping("/me")
    @Operation(summary = "Lista os ingressos do cliente autenticado")
    public List<MyTicketResponse> listMyTickets(
            Authentication authentication
    ) {
        return ticketService.listMyTickets(authentication.getName());
    }
}