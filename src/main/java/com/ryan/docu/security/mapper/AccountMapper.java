package com.ryan.docu.security.mapper;

import com.ryan.docu.mapper.UserMapper;
import com.ryan.docu.security.model.Account;
import com.ryan.docu.security.model.dto.AccountCreateDTO;
import com.ryan.docu.security.model.dto.AccountDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring",
        uses = {UserMapper.class})
public interface AccountMapper {

    @Mapping(target = "accountId", ignore = true)
    @Mapping(target = "user", ignore = true)
    Account toEntity(AccountCreateDTO accountCreateDTO);

    AccountDTO toDTO(Account account);
}
