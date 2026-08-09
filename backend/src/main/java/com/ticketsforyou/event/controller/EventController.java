package com.ticketsforyou.event.controller;

import com.ticketsforyou.event.dto.EventSummaryResponse;
import com.ticketsforyou.event.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.ticketsforyou.event.dto.CreateEventRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import java.util.List;
import com.ticketsforyou.event.dto.EventDetailResponse;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.UUID;

@Tag(name = "Eventos", description = "Consulta e gerenciamento de eventos")
@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventSummaryResponse> listPublishedEvents() {
        return eventService.listPublishedEvents();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cria um evento em rascunho", description = "Exclusivo para organizadores.")
    public EventSummaryResponse createEvent(
            @Valid @RequestBody CreateEventRequest request,
            Authentication authentication
    ) {
        return eventService.createEvent(request, authentication.getName());
    }

    @GetMapping("/{eventId}")
    @Operation(summary = "Busca os detalhes de um evento publicado")
    public EventDetailResponse getPublishedEvent(
            @PathVariable UUID eventId
    ) {
        return eventService.getPublishedEvent(eventId);
    }

    @PatchMapping("/{eventId}/publish")
    @Operation(summary = "Publica um evento em rascunho", description = "Exclusivo para o organizador proprietário.")
    public EventSummaryResponse publishEvent(
            @PathVariable UUID eventId,
            Authentication authentication
    ) {
        return eventService.publishEvent(eventId, authentication.getName());
    }
}