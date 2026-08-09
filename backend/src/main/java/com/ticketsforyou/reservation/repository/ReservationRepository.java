package com.ticketsforyou.reservation.repository;

import com.ticketsforyou.reservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
}