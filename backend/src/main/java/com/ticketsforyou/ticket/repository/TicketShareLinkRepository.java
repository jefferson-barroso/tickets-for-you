package com.ticketsforyou.ticket.repository;

import com.ticketsforyou.ticket.model.TicketShareLink;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TicketShareLinkRepository
        extends JpaRepository<TicketShareLink, UUID> {

    Optional<TicketShareLink> findByTokenHashAndRevokedAtIsNull(
            String tokenHash
    );
}