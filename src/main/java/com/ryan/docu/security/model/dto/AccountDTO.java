package com.ryan.docu.security.model.dto;

import com.ryan.docu.model.dto.UserDTO;
import lombok.Data;

@Data
public class AccountDTO {
    private String username;

    private UserDTO user;
}
