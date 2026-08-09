package com.ticketsforyou.auth.service;

import com.ticketsforyou.auth.dto.LoginRequest;
import com.ticketsforyou.auth.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(
                        request.email(),
                        request.password()
                )
        );

        UserDetails user = (UserDetails) authentication.getPrincipal();

        String role = user.getAuthorities()
                .stream()
                .findFirst()
                .orElseThrow()
                .getAuthority()
                .replace("ROLE_", "");

        return new LoginResponse(
                jwtService.generateToken(user.getUsername(), role),
                "Bearer",
                jwtService.getExpirationInSeconds(),
                role
        );
    }
}