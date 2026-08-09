package com.ticketsforyou.reservation.repository;

import com.ticketsforyou.reservation.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT reservation FROM Reservation reservation WHERE reservation.id = :id")
    Optional<Reservation> findByIdForUpdate(@Param("id") UUID id);
}