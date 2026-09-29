package com.example.expense.auth;

import com.example.expense.exception.BusinessException;
import com.example.expense.user.Role;
import com.example.expense.user.User;
import com.example.expense.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest validRequest;

    @BeforeEach
    void setUp() {
        validRequest = RegisterRequest.builder()
                .username("testuser")
                .email("test@example.com")
                .password("Password123")
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new user with hashed password")
    void register_Success() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("$2a$10$hashedpassword");

        User savedUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("$2a$10$hashedpassword")
                .role(Role.ROLE_USER)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthResponse response = authService.register(validRequest);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getRole()).isEqualTo("ROLE_USER");

        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("Password123");
    }

    @Test
    @DisplayName("Should throw BusinessException when email is already registered")
    void register_DuplicateEmail_ThrowsBusinessException() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(validRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Email đã được sử dụng");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw BusinessException when username is already taken")
    void register_DuplicateUsername_ThrowsBusinessException() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(validRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Tên đăng nhập đã tồn tại");

        verify(userRepository, never()).save(any(User.class));
    }
}
