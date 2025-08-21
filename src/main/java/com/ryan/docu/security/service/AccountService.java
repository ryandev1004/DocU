package com.ryan.docu.security.service;

import com.ryan.docu.security.mapper.AccountMapper;
import com.ryan.docu.security.model.dto.AccountCreateDTO;
import com.ryan.docu.security.model.dto.AccountDTO;
import com.ryan.docu.security.model.dto.AccountLoginRequestDTO;
import com.ryan.docu.security.repo.AccountRepo;
import com.ryan.docu.security.tokens.JwtService;
import com.ryan.docu.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepo accountRepo;
    private final AccountMapper accountMapper;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(12);

    public AccountDTO createAccount(AccountCreateDTO account) {
        var newAccount = accountMapper.toEntity(account);
        newAccount.setPassword(bCryptPasswordEncoder.encode(newAccount.getPassword()));
        var newUser = userService.createUser(account.getUser());
        newAccount.setUser(newUser);
        return accountMapper.toDTO(accountRepo.save(newAccount));
    }

    public String login(AccountLoginRequestDTO request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        return auth.isAuthenticated() ? jwtService.generateToken(request.getUsername()) : "Login failed";
    }
}
