package com.ticketsforyou.reservation.repository;

import com.ticketsforyou.reservation.model.ReservationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReservationItemRepository extends JpaRepository<ReservationItem, UUID> {
    List<ReservationItem> findByReservationId(UUID reservationId);
}