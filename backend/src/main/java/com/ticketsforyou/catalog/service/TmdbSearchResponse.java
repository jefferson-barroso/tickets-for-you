package com.ticketsforyou.catalog.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record TmdbSearchResponse(
        List<TmdbMovie> results
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TmdbMovie(
            Long id,
            String title,

            @JsonProperty("original_title")
            String originalTitle,

            String overview,

            @JsonProperty("release_date")
            String releaseDate,

            @JsonProperty("poster_path")
            String posterPath
    ) {
    }
}