package com.ticketsforyou.event.repository;

import com.ticketsforyou.event.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {

    Optional<TicketType> findFirstByEventIdOrderByPriceAsc(UUID eventId);
    List<TicketType> findByEventIdOrderByPriceAsc(UUID eventId);
}