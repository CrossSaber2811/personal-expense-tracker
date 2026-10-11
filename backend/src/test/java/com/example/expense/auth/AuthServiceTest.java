package com.example.expense.auth;

import com.example.expense.config.JwtTokenProvider;
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
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest validRegisterRequest;
    private LoginRequest validLoginRequest;
    private User existingUser;

    @BeforeEach
    void setUp() {
        validRegisterRequest = RegisterRequest.builder()
                .username("testuser")
                .email("test@example.com")
                .password("Password123")
                .build();

        validLoginRequest = LoginRequest.builder()
                .email("test@example.com")
                .password("Password123")
                .build();

        existingUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("$2a$10$hashedpassword")
                .role(Role.ROLE_USER)
                .build();
    }

    @Test
    @DisplayName("Should successfully register a new user with hashed password")
    void register_Success() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("$2a$10$hashedpassword");
        when(userRepository.save(any(User.class))).thenReturn(existingUser);

        AuthResponse response = authService.register(validRegisterRequest);

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

        assertThatThrownBy(() -> authService.register(validRegisterRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Email đã được sử dụng");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw BusinessException when username is already taken")
    void register_DuplicateUsername_ThrowsBusinessException() {
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(validRegisterRequest))
                .isInstanceOf(BusinessException.class)
                .hasMessage("Tên đăng nhập đã tồn tại");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully login with correct credentials and return JWT token")
    void login_Success() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("Password123", "$2a$10$hashedpassword")).thenReturn(true);
        when(jwtTokenProvider.generateToken(existingUser)).thenReturn("mock.jwt.token");
        when(jwtTokenProvider.getExpirationMs()).thenReturn(86400000L);

        AuthResponse response = authService.login(validLoginRequest);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mock.jwt.token");
        assertThat(response.getType()).isEqualTo("Bearer");
        assertThat(response.getExpiresIn()).isEqualTo(86400000L);
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getRole()).isEqualTo("ROLE_USER");
        assertThat(response.getMessage()).isEqualTo("Đăng nhập thành công");

        verify(userRepository).findByEmail("test@example.com");
        verify(passwordEncoder).matches("Password123", "$2a$10$hashedpassword");
        verify(jwtTokenProvider).generateToken(existingUser);
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when email is unknown")
    void login_UnknownEmail_ThrowsBadCredentialsException() {
        when(userRepository.findByEmail("unknown@example.com")).thenReturn(Optional.empty());

        LoginRequest unknownRequest = LoginRequest.builder()
                .email("unknown@example.com")
                .password("Password123")
                .build();

        assertThatThrownBy(() -> authService.login(unknownRequest))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Email hoặc mật khẩu không chính xác");

        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtTokenProvider, never()).generateToken(any(User.class));
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when password does not match")
    void login_IncorrectPassword_ThrowsBadCredentialsException() {
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.matches("WrongPass123", "$2a$10$hashedpassword")).thenReturn(false);

        LoginRequest wrongPassRequest = LoginRequest.builder()
                .email("test@example.com")
                .password("WrongPass123")
                .build();

        assertThatThrownBy(() -> authService.login(wrongPassRequest))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessage("Email hoặc mật khẩu không chính xác");

        verify(jwtTokenProvider, never()).generateToken(any(User.class));
    }
}
