package com.example.expense.config;

import com.example.expense.user.Role;
import com.example.expense.user.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class JwtAuthenticationFilterTest {

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private CustomUserDetailsService customUserDetailsService;

    @Mock
    private FilterChain filterChain;

    @InjectMocks
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    private MockHttpServletRequest request;
    private MockHttpServletResponse response;
    private UserPrincipal userPrincipal;

    @BeforeEach
    void setUp() {
        request = new MockHttpServletRequest();
        response = new MockHttpServletResponse();
        SecurityContextHolder.clearContext();

        User user = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("$2a$10$hashedpassword")
                .role(Role.ROLE_USER)
                .build();
        userPrincipal = UserPrincipal.create(user);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("Should authenticate request when valid Bearer token is provided")
    void doFilterInternal_ValidToken_Authenticates() throws ServletException, IOException {
        String token = "valid.jwt.token";
        request.addHeader("Authorization", "Bearer " + token);

        when(jwtTokenProvider.validateToken(token)).thenReturn(true);
        when(jwtTokenProvider.getEmailFromToken(token)).thenReturn("test@example.com");
        when(customUserDetailsService.loadUserByUsername("test@example.com")).thenReturn(userPrincipal);

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        assertThat(auth).isNotNull();
        assertThat(auth.isAuthenticated()).isTrue();
        assertThat(auth.getPrincipal()).isEqualTo(userPrincipal);
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        assertThat(principal.getId()).isEqualTo(1L);

        verify(filterChain).doFilter(request, response);
    }

    @Test
    @DisplayName("Should not authenticate and allow filter chain to continue when no token is present")
    void doFilterInternal_NoToken_DoesNotAuthenticate() throws ServletException, IOException {
        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtTokenProvider);
    }

    @Test
    @DisplayName("Should not authenticate when Bearer token is invalid or expired")
    void doFilterInternal_InvalidToken_DoesNotAuthenticate() throws ServletException, IOException {
        String invalidToken = "invalid.token";
        request.addHeader("Authorization", "Bearer " + invalidToken);

        when(jwtTokenProvider.validateToken(invalidToken)).thenReturn(false);

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
        verify(customUserDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    @DisplayName("Should ignore non-Bearer Authorization headers")
    void doFilterInternal_NonBearerHeader_DoesNotAuthenticate() throws ServletException, IOException {
        request.addHeader("Authorization", "Basic dXNlcjpwYXNz");

        jwtAuthenticationFilter.doFilterInternal(request, response, filterChain);

        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNull();
        verify(filterChain).doFilter(request, response);
        verifyNoInteractions(jwtTokenProvider);
    }
}
