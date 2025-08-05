package com.ryan.docu.model.dto;

import com.ryan.docu.model.enums.FileType;
import lombok.Data;

@Data
public class DocumentListDTO {
    private String title;
    private String date;
    private FileType fileType;
}
