package com.ticketsforyou.event.repository;

import com.ticketsforyou.event.model.Event;
import com.ticketsforyou.event.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findByStatusOrderByStartsAtAsc(EventStatus status);
    Optional<Event> findByIdAndOrganizerEmail(UUID id, String organizerEmail);
    Optional<Event> findByIdAndStatus(UUID id, EventStatus status);
}