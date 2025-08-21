package com.ryan.docu.security.model.dto;

import com.ryan.docu.model.dto.UserCreateDTO;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountCreateDTO {
    @NotNull
    private String username;

    @NotNull
    private String password;

    @NotNull
    private UserCreateDTO user;
}
