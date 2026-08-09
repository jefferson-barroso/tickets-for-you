package com.ticketsforyou.catalog.service;

import com.ticketsforyou.catalog.dto.MovieCatalogResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Slf4j
public class TmdbCatalogService {

    private static final String POSTER_BASE_URL =
            "https://image.tmdb.org/t/p/w500";

    private final RestClient restClient;

    public TmdbCatalogService(
            @Value("${tmdb.base-url}") String baseUrl,
            @Value("${tmdb.access-token}") String accessToken
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + accessToken
                )
                .build();
    }

    public List<MovieCatalogResponse> searchMovies(String query) {
        try {
            TmdbSearchResponse response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/search/movie")
                            .queryParam("query", query)
                            .queryParam("language", "pt-BR")
                            .queryParam("include_adult", false)
                            .queryParam("page", 1)
                            .build()
                    )
                    .retrieve()
                    .body(TmdbSearchResponse.class);

            if (response == null || response.results() == null) {
                return List.of();
            }

            return response.results()
                    .stream()
                    .map(movie -> new MovieCatalogResponse(
                            movie.id(),
                            movie.title(),
                            movie.originalTitle(),
                            movie.overview(),
                            movie.releaseDate(),
                            toPosterUrl(movie.posterPath())
                    ))
                    .toList();
        } catch (RestClientException exception) {
            log.error("Erro ao consultar catálogo do TMDb", exception);

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Não foi possível consultar o catálogo de filmes",
                    exception
            );
        }
    }

    private String toPosterUrl(String posterPath) {
        if (posterPath == null || posterPath.isBlank()) {
            return null;
        }

        return POSTER_BASE_URL + posterPath;
    }
}