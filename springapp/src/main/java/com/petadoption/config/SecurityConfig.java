package com.petadoption.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public — auth
                .requestMatchers("/api/auth/**").permitAll()
                // Public — read pets & shelter
                .requestMatchers(HttpMethod.GET, "/api/pets/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/shelter").permitAll()
                // Public — submit adoption request
                .requestMatchers(HttpMethod.POST, "/api/adoption-requests/pet/**").permitAll()
                // Public — donation redirect
                .requestMatchers(HttpMethod.GET, "/api/donation/redirect").permitAll()
                // Swagger / Actuator health (public)
                .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/api-docs/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                // Favorites — authenticated users
                .requestMatchers("/api/favorites/**").hasAnyRole("USER", "ADMIN", "MANAGER")
                // Adoption requests — staff only (read/update/delete)
                .requestMatchers(HttpMethod.GET, "/api/adoption-requests/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/adoption-requests/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/adoption-requests/**").hasAnyRole("ADMIN", "MANAGER")
                // Pet management — ADMIN can add/update, MANAGER can also delete
                .requestMatchers(HttpMethod.POST, "/api/pets/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/pets/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/pets/**").hasRole("MANAGER")
                // Shelter update — staff only
                .requestMatchers(HttpMethod.PUT, "/api/shelter").hasAnyRole("ADMIN", "MANAGER")
                // Analytics — staff only
                .requestMatchers("/api/analytics/**").hasAnyRole("ADMIN", "MANAGER")
                // Donation confirm — staff only
                .requestMatchers(HttpMethod.POST, "/api/donation/confirm").hasAnyRole("ADMIN", "MANAGER")
                // Everything else requires authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
