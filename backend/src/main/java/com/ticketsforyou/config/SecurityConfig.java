package com.ticketsforyou.config;

import com.ticketsforyou.auth.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import com.ticketsforyou.auth.service.JwtAuthenticationFilter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/events/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/events").hasRole("ORGANIZADOR")
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/v1/events/*/publish"
                        ).hasRole("ORGANIZADOR")
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/reservations"
                        ).hasRole("CLIENTE")
                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/v1/reservations/*/payment"
                        ).hasRole("CLIENTE")
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/tickets/me"
                        ).hasRole("CLIENTE")
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/gate/validate-ticket"
                        ).hasRole("PORTARIA")
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/tickets/*/share"
                        ).hasRole("CLIENTE")
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/tickets/shared/**"
                        ).permitAll()
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/catalog/**"
                        ).hasRole("ORGANIZADOR")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(customUserDetailsService);

        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationProvider authenticationProvider
    ) {
        return new ProviderManager(List.of(authenticationProvider));
    }
}