package com.ticketsforyou.catalog.dto;

public record MovieCatalogResponse(
        Long id,
        String title,
        String originalTitle,
        String overview,
        String releaseDate,
        String posterUrl
) {
}