package com.yaquedo.security.jwt;

import com.yaquedo.security.UserDetailsImpl;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-expiration-ms}")
    private long accessExpirationMs;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    public void validateConfig() {
        try {
            key();
            log.info("JWT token provider initialized successfully");
        } catch (Exception e) {
            log.error("Failed to initialize JWT token provider: {}", e.getMessage(), e);
            throw new RuntimeException("JWT configuration is invalid", e);
        }
    }

    private SecretKey key() {
        if (jwtSecret == null || jwtSecret.isEmpty()) {
            throw new IllegalStateException("JWT secret is not configured");
        }

        String secret = jwtSecret.trim();
        byte[] keyBytes;

        // Try to decode as base64 first
        try {
            keyBytes = Decoders.BASE64.decode(secret);
            log.debug("JWT secret decoded as BASE64, length: {}", keyBytes.length);
        } catch (Exception ex) {
            // Fall back to UTF-8 encoding
            keyBytes = secret.getBytes(StandardCharsets.UTF_8);
            log.debug("JWT secret treated as plain text UTF-8, length: {}", keyBytes.length);
        }

        // Ensure key is at least 32 bytes for HS512
        if (keyBytes.length < 32) {
            try {
                keyBytes = MessageDigest.getInstance("SHA-256").digest(keyBytes);
                log.debug("JWT secret padded with SHA-256, final length: {}", keyBytes.length);
            } catch (NoSuchAlgorithmException e) {
                throw new IllegalStateException("Unable to derive JWT signing key", e);
            }
        }

        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();
        return generateToken(userPrincipal.getEmail(), userPrincipal.getId(), accessExpirationMs);
    }

    public String generateAccessToken(String email, Long userId) {
        return generateToken(email, userId, accessExpirationMs);
    }

    public String generateRefreshToken(String email, Long userId) {
        return generateToken(email, userId, refreshExpirationMs);
    }

    private String generateToken(String email, Long userId, long expirationMs) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key(), Jwts.SIG.HS512)
                .compact();
    }

    public String getEmailFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.getSubject();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.get("userId", Long.class);
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    private Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getAccessExpirationMs() {
        return accessExpirationMs;
    }
}
