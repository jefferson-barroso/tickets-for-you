package com.ticketsforyou.event.service;


import com.ticketsforyou.event.dto.EventSummaryResponse;
import com.ticketsforyou.event.enums.EventStatus;
import com.ticketsforyou.event.model.Event;
import com.ticketsforyou.event.repository.EventRepository;
import com.ticketsforyou.event.repository.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;

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
}