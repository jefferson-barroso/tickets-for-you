package com.ticketsforyou.event.controller;

import com.ticketsforyou.event.dto.EventSummaryResponse;
import com.ticketsforyou.event.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public List<EventSummaryResponse> listPublishedEvents() {
        return eventService.listPublishedEvents();
    }
}