package com.ticketsforyou;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TicketsForYouApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(TicketsForYouApiApplication.class, args);
	}


}
