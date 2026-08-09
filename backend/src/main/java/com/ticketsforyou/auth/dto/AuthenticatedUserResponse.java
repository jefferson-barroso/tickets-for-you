package com.ticketsforyou.auth.dto;

public record AuthenticatedUserResponse(
        String email,
        String role
) {
}