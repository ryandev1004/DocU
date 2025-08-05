package com.ryan.docu.model.dto;

import com.ryan.docu.model.Document;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class UserDTO {
    private UUID userId;
    private String username;
    private List<DocumentDTO> documents;
}
