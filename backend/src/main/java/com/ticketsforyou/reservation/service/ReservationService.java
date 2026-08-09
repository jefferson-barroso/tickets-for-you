package com.ticketsforyou.reservation.service;

import com.ticketsforyou.event.enums.EventStatus;
import com.ticketsforyou.event.model.Event;
import com.ticketsforyou.event.model.TicketType;
import com.ticketsforyou.event.repository.TicketTypeRepository;
import com.ticketsforyou.reservation.dto.CreateReservationItemRequest;
import com.ticketsforyou.reservation.dto.CreateReservationRequest;
import com.ticketsforyou.reservation.dto.ReservationResponse;
import com.ticketsforyou.reservation.enums.ReservationStatus;
import com.ticketsforyou.reservation.model.Reservation;
import com.ticketsforyou.reservation.model.ReservationItem;
import com.ticketsforyou.reservation.repository.ReservationItemRepository;
import com.ticketsforyou.reservation.repository.ReservationRepository;
import com.ticketsforyou.user.model.AppUser;
import com.ticketsforyou.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.ticketsforyou.reservation.dto.PaymentResponse;
import com.ticketsforyou.reservation.dto.ProcessPaymentRequest;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationItemRepository reservationItemRepository;

    @Transactional
    public ReservationResponse createReservation(
            String customerEmail,
            CreateReservationRequest request
    ) {
        AppUser customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente não encontrado"
                ));

        validateDuplicatedTicketTypes(request.items());

        List<CreateReservationItemRequest> requestedItems = request.items()
                .stream()
                .sorted(Comparator.comparing(CreateReservationItemRequest::ticketTypeId))
                .toList();

        List<TicketType> ticketTypes = requestedItems.stream()
                .map(item -> getTicketTypeForUpdate(item.ticketTypeId()))
                .toList();

        Event event = ticketTypes.get(0).getEvent();

        validateReservationEvent(request.eventId(), event, ticketTypes);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (int index = 0; index < requestedItems.size(); index++) {
            CreateReservationItemRequest requestedItem = requestedItems.get(index);
            TicketType ticketType = ticketTypes.get(index);

            if (ticketType.getAvailableQuantity() < requestedItem.quantity()) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Quantidade indisponível para o setor: " + ticketType.getName()
                );
            }

            ticketType.setAvailableQuantity(
                    ticketType.getAvailableQuantity() - requestedItem.quantity()
            );

            totalAmount = totalAmount.add(
                    ticketType.getPrice().multiply(
                            BigDecimal.valueOf(requestedItem.quantity())
                    )
            );
        }

        Reservation reservation = new Reservation();
        reservation.setCustomer(customer);
        reservation.setEvent(event);
        reservation.setStatus(ReservationStatus.AGUARDANDO_PAGAMENTO);
        reservation.setTotalAmount(totalAmount);
        reservation.setExpiresAt(OffsetDateTime.now().plusMinutes(15));

        Reservation savedReservation = reservationRepository.save(reservation);

        List<ReservationItem> reservationItems = createReservationItems(
                savedReservation,
                requestedItems,
                ticketTypes
        );

        reservationItemRepository.saveAll(reservationItems);

        return new ReservationResponse(
                savedReservation.getId(),
                event.getId(),
                savedReservation.getStatus(),
                savedReservation.getTotalAmount(),
                savedReservation.getExpiresAt()
        );
    }

    private TicketType getTicketTypeForUpdate(UUID ticketTypeId) {
        return ticketTypeRepository.findByIdForUpdate(ticketTypeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Setor não encontrado"
                ));
    }

    private void validateDuplicatedTicketTypes(
            List<CreateReservationItemRequest> items
    ) {
        long distinctTicketTypes = items.stream()
                .map(CreateReservationItemRequest::ticketTypeId)
                .distinct()
                .count();

        if (distinctTicketTypes != items.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Um setor não pode ser informado mais de uma vez"
            );
        }
    }

    private void validateReservationEvent(
            UUID requestedEventId,
            Event event,
            List<TicketType> ticketTypes
    ) {
        boolean allTicketTypesBelongToEvent = ticketTypes.stream()
                .allMatch(ticketType ->
                        ticketType.getEvent().getId().equals(requestedEventId)
                );

        if (!allTicketTypesBelongToEvent) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Todos os setores devem pertencer ao evento informado"
            );
        }

        if (event.getStatus() != EventStatus.PUBLICADO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "A reserva só pode ser realizada para eventos publicados"
            );
        }
    }

    private List<ReservationItem> createReservationItems(
            Reservation reservation,
            List<CreateReservationItemRequest> requestedItems,
            List<TicketType> ticketTypes
    ) {
        return requestedItems.stream()
                .map(requestedItem -> {
                    TicketType ticketType = ticketTypes.stream()
                            .filter(type -> type.getId().equals(requestedItem.ticketTypeId()))
                            .findFirst()
                            .orElseThrow();

                    ReservationItem item = new ReservationItem();
                    item.setReservation(reservation);
                    item.setTicketType(ticketType);
                    item.setQuantity(requestedItem.quantity());
                    item.setUnitPrice(ticketType.getPrice());

                    return item;
                })
                .toList();
    }
    @Transactional
    public PaymentResponse processPayment(
            UUID reservationId,
            String customerEmail,
            ProcessPaymentRequest request
    ) {
        Reservation reservation = reservationRepository
                .findByIdForUpdate(reservationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva não encontrada"
                ));

        if (!reservation.getCustomer().getEmail().equals(customerEmail)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Esta reserva não pertence ao cliente autenticado"
            );
        }

        if (reservation.getStatus() != ReservationStatus.AGUARDANDO_PAGAMENTO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Esta reserva não está aguardando pagamento"
            );
        }

        if (reservation.getExpiresAt().isBefore(OffsetDateTime.now())) {
            restoreStock(reservation);
            reservation.setStatus(ReservationStatus.EXPIRADA);

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "O prazo para pagamento desta reserva expirou"
            );
        }

        if (request.approved()) {
            reservation.setStatus(ReservationStatus.PAGA);
        } else {
            restoreStock(reservation);
            reservation.setStatus(ReservationStatus.PAGAMENTO_RECUSADO);
        }

        return new PaymentResponse(
                reservation.getId(),
                reservation.getStatus(),
                reservation.getTotalAmount()
        );
    }

    private void restoreStock(Reservation reservation) {
        List<ReservationItem> reservationItems = reservationItemRepository
                .findByReservationId(reservation.getId());

        for (ReservationItem reservationItem : reservationItems) {
            TicketType ticketType = ticketTypeRepository
                    .findByIdForUpdate(reservationItem.getTicketType().getId())
                    .orElseThrow();

            ticketType.setAvailableQuantity(
                    ticketType.getAvailableQuantity() + reservationItem.getQuantity()
            );
        }
    }
}