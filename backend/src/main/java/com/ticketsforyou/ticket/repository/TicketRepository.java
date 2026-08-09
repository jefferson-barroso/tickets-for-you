package com.ticketsforyou.ticket.repository;

import com.ticketsforyou.ticket.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {

    List<Ticket> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);

    @Query("""
    SELECT ticket
    FROM Ticket ticket
    JOIN FETCH ticket.event
    JOIN FETCH ticket.reservationItem reservationItem
    JOIN FETCH reservationItem.ticketType
    WHERE ticket.customer.email = :customerEmail
    ORDER BY ticket.createdAt DESC
    """)
    List<Ticket> findMyTickets(@Param("customerEmail") String customerEmail);
}