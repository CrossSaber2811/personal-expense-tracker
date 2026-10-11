package com.example.expense.user;

import com.example.expense.exception.BusinessException;
import com.example.expense.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .password("$2a$10$hashedPassword123")
                .role(Role.ROLE_USER)
                .createdAt(LocalDateTime.now().minusDays(1))
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("getProfile should return UserResponse when user exists")
    void getProfile_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        UserResponse response = userService.getProfile(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getEmail()).isEqualTo("test@example.com");
        assertThat(response.getRole()).isEqualTo("ROLE_USER");
        assertThat(response.getCreatedAt()).isNotNull();

        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("getProfile should throw ResourceNotFoundException when user does not exist")
    void getProfile_UserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getProfile(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy người dùng với ID: 99");

        verify(userRepository, times(1)).findById(99L);
    }

    @Test
    @DisplayName("changePassword should succeed when current password matches and new password is valid")
    void changePassword_Success() {
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("OldPassword123")
                .newPassword("NewPassword456")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("OldPassword123", "$2a$10$hashedPassword123")).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456", "$2a$10$hashedPassword123")).thenReturn(false);
        when(passwordEncoder.encode("NewPassword456")).thenReturn("$2a$10$newHashedPassword456");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        MessageResponse response = userService.changePassword(1L, request);

        assertThat(response).isNotNull();
        assertThat(response.getMessage()).isEqualTo("Đổi mật khẩu thành công");
        assertThat(sampleUser.getPassword()).isEqualTo("$2a$10$newHashedPassword456");

        verify(userRepository, times(1)).save(sampleUser);
    }

    @Test
    @DisplayName("changePassword should throw BusinessException when current password does not match")
    void changePassword_WrongCurrentPassword() {
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("WrongPassword")
                .newPassword("NewPassword456")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPassword", "$2a$10$hashedPassword123")).thenReturn(false);

        assertThatThrownBy(() -> userService.changePassword(1L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Mật khẩu hiện tại không chính xác");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("changePassword should throw BusinessException when new password equals current password")
    void changePassword_NewPasswordSameAsOld() {
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("OldPassword123")
                .newPassword("OldPassword123")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("OldPassword123", "$2a$10$hashedPassword123")).thenReturn(true);

        assertThatThrownBy(() -> userService.changePassword(1L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Mật khẩu mới không được trùng với mật khẩu hiện tại");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("changePassword should throw ResourceNotFoundException when user does not exist")
    void changePassword_UserNotFound() {
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("OldPassword123")
                .newPassword("NewPassword456")
                .build();

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.changePassword(99L, request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Không tìm thấy người dùng với ID: 99");

        verify(userRepository, never()).save(any(User.class));
    }
}
