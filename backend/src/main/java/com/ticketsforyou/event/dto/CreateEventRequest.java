package com.ticketsforyou.event.dto;

import com.ticketsforyou.event.enums.EventType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.OffsetDateTime;
import java.util.List;

public record CreateEventRequest(
        @NotBlank(message = "O título é obrigatório")
        @Size(max = 160)
        String title,

        String description,

        @NotNull(message = "O tipo do evento é obrigatório")
        EventType eventType,

        @NotNull(message = "A data do evento é obrigatória")
        @Future(message = "A data do evento deve estar no futuro")
        OffsetDateTime startsAt,

        @NotBlank(message = "O local é obrigatório")
        @Size(max = 160)
        String venueName,

        @NotBlank(message = "O endereço é obrigatório")
        @Size(max = 255)
        String venueAddress,

        String posterUrl,

        @NotEmpty(message = "O evento deve possuir ao menos um setor")
        List<@Valid CreateTicketTypeRequest> ticketTypes
) {
}