package com.ryan.docu.model.dto;

import com.ryan.docu.model.enums.FileType;
import com.ryan.docu.model.enums.Format;
import lombok.Data;

import java.util.UUID;

@Data
public class DocumentDTO {
    private UUID docId;
    private String title;
    private String date;
    private Format format;
    private FileType fileType;
}
