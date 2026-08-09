package com.ticketsforyou.ticket.service;

import com.ticketsforyou.auth.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketQrService {

    private final JwtService jwtService;

    public String generatePayload(UUID ticketCode) {
        return jwtService.generateTicketToken(ticketCode);
    }

    public String hashPayload(String payload) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                    .digest(payload.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 não está disponível", exception);
        }
    }
}