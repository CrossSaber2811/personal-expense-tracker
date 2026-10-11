package com.example.expense.user;

import com.example.expense.auth.AuthResponse;
import com.example.expense.auth.LoginRequest;
import com.example.expense.auth.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@SuppressWarnings("null")
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String registerAndLogin(String username, String email, String password) throws Exception {
        RegisterRequest registerReq = RegisterRequest.builder()
                .username(username)
                .email(email)
                .password(password)
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerReq)))
                .andExpect(status().isCreated());

        LoginRequest loginReq = LoginRequest.builder()
                .email(email)
                .password(password)
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponse authResponse = objectMapper.readValue(
                loginResult.getResponse().getContentAsString(),
                AuthResponse.class
        );

        return authResponse.getToken();
    }

    @Test
    @DisplayName("GET /api/users/me should return user profile and never expose password hash")
    void getProfile_Authenticated_ReturnsProfileWithoutPassword() throws Exception {
        String token = registerAndLogin("profileuser", "profile@example.com", "Password123");

        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.username").value("profileuser"))
                .andExpect(jsonPath("$.email").value("profile@example.com"))
                .andExpect(jsonPath("$.role").value("ROLE_USER"))
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/users/me without token should return 401 Unauthorized")
    void getProfile_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }

    @Test
    @DisplayName("PUT /api/users/me/password should change password and allow login with new password")
    void changePassword_Success_AllowsLoginWithNewPassword() throws Exception {
        String token = registerAndLogin("changepassuser", "changepass@example.com", "OldPassword123");

        ChangePasswordRequest changeReq = ChangePasswordRequest.builder()
                .currentPassword("OldPassword123")
                .newPassword("NewPassword456")
                .build();

        // 1. Change password
        mockMvc.perform(put("/api/users/me/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changeReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đổi mật khẩu thành công"))
                .andExpect(jsonPath("$.password").doesNotExist());

        // 2. Login with old password should now fail (401)
        LoginRequest oldLogin = LoginRequest.builder()
                .email("changepass@example.com")
                .password("OldPassword123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(oldLogin)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));

        // 3. Login with new password should succeed (200)
        LoginRequest newLogin = LoginRequest.builder()
                .email("changepass@example.com")
                .password("NewPassword456")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newLogin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString());
    }

    @Test
    @DisplayName("PUT /api/users/me/password with incorrect current password should return 400 Bad Request")
    void changePassword_WrongCurrentPassword_Returns400() throws Exception {
        String token = registerAndLogin("wrongcuruser", "wrongcur@example.com", "Password123");

        ChangePasswordRequest changeReq = ChangePasswordRequest.builder()
                .currentPassword("IncorrectCurrent123")
                .newPassword("NewPassword456")
                .build();

        mockMvc.perform(put("/api/users/me/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changeReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("BAD_REQUEST"))
                .andExpect(jsonPath("$.message").value("Mật khẩu hiện tại không chính xác"));
    }

    @Test
    @DisplayName("PUT /api/users/me/password with new password same as current should return 400 Bad Request")
    void changePassword_NewPasswordSameAsOld_Returns400() throws Exception {
        String token = registerAndLogin("samepassuser", "samepass@example.com", "Password123");

        ChangePasswordRequest changeReq = ChangePasswordRequest.builder()
                .currentPassword("Password123")
                .newPassword("Password123")
                .build();

        mockMvc.perform(put("/api/users/me/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changeReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("BAD_REQUEST"))
                .andExpect(jsonPath("$.message").value("Mật khẩu mới không được trùng với mật khẩu hiện tại"));
    }

    @Test
    @DisplayName("PUT /api/users/me/password with invalid new password format should return 400 Bad Request")
    void changePassword_InvalidNewPassword_Returns400() throws Exception {
        String token = registerAndLogin("weaknewuser", "weaknew@example.com", "Password123");

        ChangePasswordRequest changeReq = ChangePasswordRequest.builder()
                .currentPassword("Password123")
                .newPassword("onlyletters")
                .build();

        mockMvc.perform(put("/api/users/me/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changeReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.validationErrors.newPassword").exists());
    }

    @Test
    @DisplayName("PUT /api/users/me/password without token should return 401 Unauthorized")
    void changePassword_Unauthenticated_Returns401() throws Exception {
        ChangePasswordRequest changeReq = ChangePasswordRequest.builder()
                .currentPassword("OldPassword123")
                .newPassword("NewPassword456")
                .build();

        mockMvc.perform(put("/api/users/me/password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changeReq)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("UNAUTHORIZED"));
    }
}
