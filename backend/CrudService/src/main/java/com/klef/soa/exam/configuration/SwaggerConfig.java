package com.klef.soa.exam.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI subscriptionPlanOpenAPI() {
        return new OpenAPI().info(new Info().title("Subscription Plan API")
            .description("CRUD API for the SubscriptionPlan exam task").version("1.0"));
    }
}
