package com.example.expense.config;

import com.example.expense.user.Role;
import com.example.expense.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class JwtTokenProviderTest {

    private static final String TEST_SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final long EXPIRATION_MS = 86400000L;

    private JwtTokenProvider jwtTokenProvider;
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(TEST_SECRET, EXPIRATION_MS);

        testUser = User.builder()
                .id(99L)
                .username("testjwtuser")
                .email("jwt@example.com")
                .password("$2a$10$hashedpassword")
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    @DisplayName("Should generate a valid JWT token containing all required claims")
    void generateToken_ShouldContainAllClaims() {
        String token = jwtTokenProvider.generateToken(testUser);

        assertThat(token).isNotBlank();
        assertThat(jwtTokenProvider.validateToken(token)).isTrue();
        assertThat(jwtTokenProvider.getUserIdFromToken(token)).isEqualTo(99L);
        assertThat(jwtTokenProvider.getUsernameFromToken(token)).isEqualTo("testjwtuser");
        assertThat(jwtTokenProvider.getEmailFromToken(token)).isEqualTo("jwt@example.com");
        assertThat(jwtTokenProvider.getRoleFromToken(token)).isEqualTo("ROLE_USER");
    }

    @Test
    @DisplayName("Should reject tampered token with invalid signature")
    void validateToken_TamperedToken_ShouldReturnFalse() {
        String token = jwtTokenProvider.generateToken(testUser);
        String tamperedToken = token.substring(0, token.length() - 5) + "abcde";

        assertThat(jwtTokenProvider.validateToken(tamperedToken)).isFalse();
    }

    @Test
    @DisplayName("Should reject expired token")
    void validateToken_ExpiredToken_ShouldReturnFalse() throws InterruptedException {
        // Provider with 1 millisecond expiration duration
        JwtTokenProvider expiredProvider = new JwtTokenProvider(TEST_SECRET, 1L);
        String expiredToken = expiredProvider.generateToken(testUser);

        Thread.sleep(10); // Wait for token to expire

        assertThat(jwtTokenProvider.validateToken(expiredToken)).isFalse();
    }

    @Test
    @DisplayName("Should reject malformed or blank token")
    void validateToken_MalformedToken_ShouldReturnFalse() {
        assertThat(jwtTokenProvider.validateToken("")).isFalse();
        assertThat(jwtTokenProvider.validateToken("invalid.token.string")).isFalse();
        assertThat(jwtTokenProvider.validateToken(null)).isFalse();
    }

    @Test
    @DisplayName("Should throw IllegalArgumentException if secret key is shorter than 32 characters")
    void constructor_WeakSecret_ThrowsIllegalArgumentException() {
        assertThatThrownBy(() -> new JwtTokenProvider("short-secret-key", EXPIRATION_MS))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at least 32 characters");
    }
}
