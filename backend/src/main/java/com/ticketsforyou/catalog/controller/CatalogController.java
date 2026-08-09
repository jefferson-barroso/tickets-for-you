package com.ticketsforyou.catalog.controller;

import com.ticketsforyou.catalog.dto.MovieCatalogResponse;
import com.ticketsforyou.catalog.service.TmdbCatalogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog")
@RequiredArgsConstructor
@Validated
@Tag(name = "Catálogo externo", description = "Filmes consultados no TMDb")
public class CatalogController {

    private final TmdbCatalogService tmdbCatalogService;

    @GetMapping("/movies")
    @Operation(summary = "Busca filmes no catálogo do TMDb")
    public List<MovieCatalogResponse> searchMovies(
            @RequestParam
            @NotBlank(message = "Informe um termo de busca")
            @Size(min = 2, max = 100)
            String query
    ) {
        return tmdbCatalogService.searchMovies(query);
    }
}