package com.ticketsforyou.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    OpenAPI ticketsForYouOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("TicketsForYou API")
                        .version("v1")
                        .description("API da plataforma de eventos e ingressos TicketsForYou."));
    }
}
