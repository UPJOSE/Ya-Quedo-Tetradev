package com.yaquedo.security.jwt;

import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class JwtTokenProviderTest {

    @Test
    void shouldGenerateTokenForPlainTextSecret() throws Exception {
        JwtTokenProvider jwtTokenProvider = new JwtTokenProvider();

        Field secretField = JwtTokenProvider.class.getDeclaredField("jwtSecret");
        secretField.setAccessible(true);
        secretField.set(jwtTokenProvider, "plain-text-secret-for-tests");

        Field expirationField = JwtTokenProvider.class.getDeclaredField("accessExpirationMs");
        expirationField.setAccessible(true);
        expirationField.setLong(jwtTokenProvider, 900000L);

        String token = assertDoesNotThrow(() -> jwtTokenProvider.generateAccessToken("demo@example.com", 1L));
        assertNotNull(token);
    }
}
