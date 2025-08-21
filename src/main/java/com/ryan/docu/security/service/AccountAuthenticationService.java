package com.ryan.docu.security.service;

import com.ryan.docu.security.model.Account;
import com.ryan.docu.security.model.UserPrincipal;
import com.ryan.docu.security.repo.AccountRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AccountAuthenticationService implements UserDetailsService {

    private final AccountRepo accountRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepo.findAccountByUsername(username);
        if (account == null) {
            throw new UsernameNotFoundException("ERROR: Account with username '" + username + "' not found.");
        }
        return new UserPrincipal(account);
    }
}
