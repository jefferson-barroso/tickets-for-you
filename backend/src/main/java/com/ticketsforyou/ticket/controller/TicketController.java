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
import com.ticketsforyou.ticket.dto.SharedTicketResponse;
import com.ticketsforyou.ticket.dto.TicketShareLinkResponse;
import com.ticketsforyou.ticket.service.TicketShareService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import java.util.UUID;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tickets")
@RequiredArgsConstructor
@Tag(name = "Ingressos", description = "Ingressos emitidos após pagamentos aprovados")
public class TicketController {

    private final TicketService ticketService;
    private final TicketShareService ticketShareService;

    @GetMapping("/me")
    @Operation(summary = "Lista os ingressos do cliente autenticado")
    public List<MyTicketResponse> listMyTickets(
            Authentication authentication
    ) {
        return ticketService.listMyTickets(authentication.getName());
    }

    @PostMapping("/{ticketId}/share")
    @Operation(summary = "Gera um link temporário para compartilhar ingresso")
    public TicketShareLinkResponse createShareLink(
            @PathVariable UUID ticketId,
            Authentication authentication
    ) {
        return ticketShareService.createShareLink(
                ticketId,
                authentication.getName()
        );
    }

    @GetMapping("/shared/{token}")
    @Operation(summary = "Consulta um ingresso compartilhado por link")
    public SharedTicketResponse getSharedTicket(
            @PathVariable String token
    ) {
        return ticketShareService.getSharedTicket(token);
    }

    @PatchMapping("/{ticketId}/cancel")
    @Operation(summary = "Cancela um ingresso emitido e devolve uma unidade ao estoque")
    public MyTicketResponse cancelTicket(
            @PathVariable UUID ticketId,
            Authentication authentication
    ) {
        return ticketService.cancelTicket(
                ticketId,
                authentication.getName()
        );
    }
}