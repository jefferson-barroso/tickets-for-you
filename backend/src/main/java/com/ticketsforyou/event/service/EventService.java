package com.ticketsforyou.event.service;


import com.ticketsforyou.event.dto.EventSummaryResponse;
import com.ticketsforyou.event.enums.EventStatus;
import com.ticketsforyou.event.model.Event;
import com.ticketsforyou.event.repository.EventRepository;
import com.ticketsforyou.event.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ticketsforyou.event.dto.CreateEventRequest;
import com.ticketsforyou.event.dto.CreateTicketTypeRequest;
import com.ticketsforyou.event.model.TicketType;
import com.ticketsforyou.user.model.AppUser;
import com.ticketsforyou.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import com.ticketsforyou.event.dto.EventDetailResponse;
import com.ticketsforyou.event.dto.TicketTypeResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.UUID;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<EventSummaryResponse> listPublishedEvents() {
        return eventRepository.findByStatusOrderByStartsAtAsc(EventStatus.PUBLICADO)
                .stream()
                .map(this::toSummaryResponse)
                .toList();
    }

    private EventSummaryResponse toSummaryResponse(Event event) {
        BigDecimal startingPrice = ticketTypeRepository
                .findFirstByEventIdOrderByPriceAsc(event.getId())
                .map(ticketType -> ticketType.getPrice())
                .orElse(BigDecimal.ZERO);

        return new EventSummaryResponse(
                event.getId(),
                event.getTitle(),
                event.getEventType(),
                event.getStartsAt(),
                event.getVenueName(),
                event.getVenueAddress(),
                event.getPosterUrl(),
                startingPrice,
                event.getStatus()
        );
    }

    @Transactional
    public EventSummaryResponse createEvent(
            CreateEventRequest request,
            String organizerEmail
    ) {
        AppUser organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new EntityNotFoundException("Organizador não encontrado"));

        Event event = new Event();
        event.setOrganizer(organizer);
        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setEventType(request.eventType());
        event.setStartsAt(request.startsAt());
        event.setVenueName(request.venueName());
        event.setVenueAddress(request.venueAddress());
        event.setPosterUrl(request.posterUrl());
        event.setStatus(EventStatus.RASCUNHO);

        Event savedEvent = eventRepository.save(event);

        List<TicketType> ticketTypes = request.ticketTypes()
                .stream()
                .map(ticketRequest -> createTicketType(savedEvent, ticketRequest))
                .toList();

        ticketTypeRepository.saveAll(ticketTypes);

        return toSummaryResponse(savedEvent);
    }

    private TicketType createTicketType(
            Event event,
            CreateTicketTypeRequest request
    ) {
        TicketType ticketType = new TicketType();
        ticketType.setEvent(event);
        ticketType.setName(request.name());
        ticketType.setPrice(request.price());
        ticketType.setTotalQuantity(request.totalQuantity());
        ticketType.setAvailableQuantity(request.totalQuantity());

        return ticketType;
    }

    @Transactional
    public EventSummaryResponse publishEvent(
            UUID eventId,
            String organizerEmail
    ) {
        Event event = eventRepository.findByIdAndOrganizerEmail(eventId, organizerEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Evento não encontrado"
                ));

        if (event.getStatus() != EventStatus.RASCUNHO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Apenas eventos em rascunho podem ser publicados"
            );
        }

        event.setStatus(EventStatus.PUBLICADO);

        return toSummaryResponse(event);
    }

    @Transactional(readOnly = true)
    public EventDetailResponse getPublishedEvent(UUID eventId) {
        Event event = eventRepository.findByIdAndStatus(
                        eventId,
                        EventStatus.PUBLICADO
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Evento não encontrado"
                ));

        List<TicketTypeResponse> ticketTypes = ticketTypeRepository
                .findByEventIdOrderByPriceAsc(eventId)
                .stream()
                .map(ticketType -> new TicketTypeResponse(
                        ticketType.getId(),
                        ticketType.getName(),
                        ticketType.getPrice(),
                        ticketType.getAvailableQuantity()
                ))
                .toList();

        return new EventDetailResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventType(),
                event.getStartsAt(),
                event.getVenueName(),
                event.getVenueAddress(),
                event.getPosterUrl(),
                ticketTypes
        );
    }
}