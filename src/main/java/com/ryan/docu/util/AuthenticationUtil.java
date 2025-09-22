package com.ryan.docu.util;

import com.ryan.docu.security.model.Account;
import com.ryan.docu.security.repo.AccountRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationUtil {

    private final AccountRepo accountRepository;

    public Account getAuthenticatedAccount() {
        try {
            var userDetails =
                    SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (userDetails instanceof UserDetails) {
                return accountRepository.findAccountByUsername(((UserDetails) userDetails).getUsername());
            } else {
                return null;
            }
        } catch (NullPointerException e) {
            throw new EntityNotFoundException("Account not found!");
        }
    }

    public boolean isUserUnauthorized(UUID userId) {
        var authenticatedAccount = getAuthenticatedAccount();
        if (authenticatedAccount == null) {
            return true;
        }
        var user = authenticatedAccount.getUser();
        return user == null || !user.getUserId().equals(userId);
    }

}