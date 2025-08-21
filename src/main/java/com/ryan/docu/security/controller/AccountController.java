package com.ryan.docu.security.controller;

import com.ryan.docu.security.model.dto.AccountCreateDTO;
import com.ryan.docu.security.model.dto.AccountDTO;
import com.ryan.docu.security.model.dto.AccountLoginRequestDTO;
import com.ryan.docu.security.model.dto.AccountTokenResponseDTO;
import com.ryan.docu.security.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(@Valid @RequestBody AccountCreateDTO account) {
        return ResponseEntity.ok(accountService.createAccount(account));
    }

    @PostMapping("/login")
    public ResponseEntity<AccountTokenResponseDTO> login(@RequestBody AccountLoginRequestDTO accountLoginRequest) {
        return ResponseEntity.ok(new AccountTokenResponseDTO(accountService.login(accountLoginRequest)));
    }
}
