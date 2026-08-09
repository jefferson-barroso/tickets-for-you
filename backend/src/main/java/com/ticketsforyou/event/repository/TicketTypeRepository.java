package com.ticketsforyou.event.repository;

import com.ticketsforyou.event.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {

    Optional<TicketType> findFirstByEventIdOrderByPriceAsc(UUID eventId);
    List<TicketType> findByEventIdOrderByPriceAsc(UUID eventId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT ticketType
    FROM TicketType ticketType
    JOIN FETCH ticketType.event
    WHERE ticketType.id = :id
    """)
    Optional<TicketType> findByIdForUpdate(@Param("id") UUID id);
}