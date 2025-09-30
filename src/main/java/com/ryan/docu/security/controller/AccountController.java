package com.ryan.docu.security.controller;

import com.ryan.docu.model.dto.UserDTO;
import com.ryan.docu.security.model.dto.AccountCreateDTO;
import com.ryan.docu.security.model.dto.AccountDTO;
import com.ryan.docu.security.model.dto.AccountLoginRequestDTO;
import com.ryan.docu.security.model.dto.AuthenticatedDTO;
import com.ryan.docu.security.service.AccountService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(@Valid @RequestBody AccountCreateDTO account) {
        return ResponseEntity.ok(accountService.createAccount(account));
    }

    @GetMapping
    public ResponseEntity<AccountDTO> getAccount() {
        return ResponseEntity.ok(accountService.getAccount());
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> getUserFromAccount() {
        return ResponseEntity.ok(accountService.getUserFromAccount());
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(
            @RequestBody AccountLoginRequestDTO accountLoginRequest,
            HttpServletResponse response) {
        String accessToken = accountService.login(accountLoginRequest);

        Cookie accessCookie = new Cookie("accessToken", accessToken);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false); // Set to true in production with HTTPS
        accessCookie.setPath("/");
        accessCookie.setMaxAge(60 * 30); // 30 minutes
        accessCookie.setAttribute("SameSite", "Lax"); // CSRF protection

        response.addCookie(accessCookie);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Clear the access token cookie
        Cookie accessCookie = new Cookie("accessToken", null);
        accessCookie.setHttpOnly(true);
        accessCookie.setSecure(false); // Match the login cookie settings
        accessCookie.setPath("/");
        accessCookie.setMaxAge(0); // Expire immediately
        accessCookie.setAttribute("SameSite", "Lax");

        response.addCookie(accessCookie);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/authenticated")
    public ResponseEntity<AuthenticatedDTO> isAuthenticated() {
        return ResponseEntity.ok().body(new AuthenticatedDTO(true));
    }
}