package com.ticketsforyou.event.repository;

import com.ticketsforyou.event.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {

    Optional<TicketType> findFirstByEventIdOrderByPriceAsc(UUID eventId);
}