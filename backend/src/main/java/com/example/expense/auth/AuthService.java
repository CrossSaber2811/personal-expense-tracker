package com.example.expense.auth;

import com.example.expense.config.JwtTokenProvider;
import com.example.expense.exception.BusinessException;
import com.example.expense.user.Role;
import com.example.expense.user.User;
import com.example.expense.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Processing user registration for email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration rejected: Email already exists: {}", request.getEmail());
            throw new BusinessException("Email đã được sử dụng");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            log.warn("Registration rejected: Username already exists: {}", request.getUsername());
            throw new BusinessException("Tên đăng nhập đã tồn tại");
        }

        User user = User.builder()
                .username(request.getUsername().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        return AuthResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .message("Đăng ký tài khoản thành công")
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();
        log.info("Processing user login attempt for email: {}", cleanEmail);

        String genericErrorMessage = "Email hoặc mật khẩu không chính xác";

        User user = userRepository.findByEmail(cleanEmail)
                .orElseThrow(() -> {
                    log.warn("Login failed: Unknown email: {}", cleanEmail);
                    return new BadCredentialsException(genericErrorMessage);
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: Incorrect password for user ID: {}", user.getId());
            throw new BadCredentialsException(genericErrorMessage);
        }

        String token = jwtTokenProvider.generateToken(user);
        log.info("User authenticated successfully. Generated JWT for user ID: {}", user.getId());

        return AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .expiresIn(jwtTokenProvider.getExpirationMs())
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .message("Đăng nhập thành công")
                .build();
    }
}
