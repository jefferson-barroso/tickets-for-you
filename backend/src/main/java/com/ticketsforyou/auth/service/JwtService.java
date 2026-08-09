package com.ticketsforyou.auth.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import io.jsonwebtoken.JwtException;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.UUID;
import io.jsonwebtoken.Claims;

@Service
public class JwtService {

    @Value("${security.jwt.secret}")
    private String secret;

    @Value("${security.jwt.expiration-minutes}")
    private long expirationMinutes;

    public String generateToken(String email, String role) {
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(email)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(expirationMinutes, ChronoUnit.MINUTES)))
                .signWith(getSigningKey())
                .compact();
    }

    public long getExpirationInSeconds() {
        return expirationMinutes * 60;
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean isTokenValid(String token, UserDetails user) {
        try {
            return extractEmail(token).equals(user.getUsername());
        } catch (JwtException | IllegalArgumentException exception) {
            return false;
        }
    }


    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateTicketToken(UUID ticketCode) {
        return Jwts.builder()
                .subject(ticketCode.toString())
                .claim("type", "TICKET")
                .signWith(getSigningKey())
                .compact();
    }

    public UUID extractTicketCode(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        if (!"TICKET".equals(claims.get("type", String.class))) {
            throw new JwtException("Token não representa um ingresso");
        }

        return UUID.fromString(claims.getSubject());
    }
}