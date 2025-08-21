package com.ryan.docu.security.repo;

import com.ryan.docu.security.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AccountRepo extends JpaRepository<Account, UUID> {
    Account findAccountByUsername(String username);
}
