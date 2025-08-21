package com.ryan.docu.security.model.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AccountLoginRequestDTO {
    @NotNull
    private String username;

    @NotNull
    private String password;
}
