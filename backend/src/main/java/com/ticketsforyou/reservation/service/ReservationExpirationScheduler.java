package com.ticketsforyou.reservation.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReservationExpirationScheduler {

    private final ReservationService reservationService;

    @Scheduled(
            fixedDelayString = "${reservation.expiration-check-ms}"
    )
    public void expirePendingReservations() {
        int expiredReservations = reservationService
                .expirePendingReservations();

        if (expiredReservations > 0) {
            log.info(
                    "{} reserva(s) expirada(s) e estoque restaurado",
                    expiredReservations
            );
        }
    }
}