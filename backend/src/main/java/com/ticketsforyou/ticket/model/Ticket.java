package com.ticketsforyou.ticket.model;

import com.ticketsforyou.event.model.Event;
import com.ticketsforyou.reservation.model.ReservationItem;
import com.ticketsforyou.ticket.enums.TicketStatus;
import com.ticketsforyou.user.model.AppUser;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_item_id", nullable = false)
    private ReservationItem reservationItem;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "customer_id", nullable = false)
    private AppUser customer;

    @Column(name = "ticket_code", nullable = false, unique = true)
    private UUID ticketCode;

    @Column(name = "qr_token_hash", nullable = false, unique = true, length = 255)
    private String qrTokenHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TicketStatus status;

    @Column(name = "checked_in_at")
    private OffsetDateTime checkedInAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;
}