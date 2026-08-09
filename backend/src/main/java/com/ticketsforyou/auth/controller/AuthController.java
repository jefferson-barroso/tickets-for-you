package com.ticketsforyou.auth.controller;

import com.ticketsforyou.auth.dto.AuthenticatedUserResponse;
import com.ticketsforyou.auth.dto.LoginRequest;
import com.ticketsforyou.auth.dto.LoginResponse;
import com.ticketsforyou.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Acesso de organizadores, clientes e portaria")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Realiza login e gera um token JWT")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    @Operation(summary = "Retorna o usuário autenticado pelo token JWT")
    public AuthenticatedUserResponse me(Authentication authentication) {
        String role = authentication.getAuthorities()
                .stream()
                .findFirst()
                .orElseThrow()
                .getAuthority()
                .replace("ROLE_", "");

        return new AuthenticatedUserResponse(
                authentication.getName(),
                role
        );
    }
}