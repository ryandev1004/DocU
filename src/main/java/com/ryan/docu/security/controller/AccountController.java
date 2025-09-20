package com.ryan.docu.security.controller;

import com.ryan.docu.model.dto.UserDTO;
import com.ryan.docu.security.model.dto.*;
import com.ryan.docu.security.service.AccountService;
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
    public ResponseEntity<AccountTokenResponseDTO> login(@RequestBody AccountLoginRequestDTO accountLoginRequest) {
        return ResponseEntity.ok(new AccountTokenResponseDTO(accountService.login(accountLoginRequest)));
    }

    @GetMapping("/authenticated")
    public ResponseEntity<AuthenticatedDTO> isAuthenticated() {
        return ResponseEntity.ok().body(new AuthenticatedDTO(true));
    }
}
