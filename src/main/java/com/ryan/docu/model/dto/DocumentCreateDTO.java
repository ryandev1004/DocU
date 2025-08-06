package com.ryan.docu.model.dto;

import com.ryan.docu.model.enums.FileType;
import com.ryan.docu.model.enums.Format;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentCreateDTO {
    private String title;
    private String name;
    private String professorName;
    private String classTitle;
    private String instituteName;
    private String bodyText;
    private String date;

    @NotNull
    private Format format;

    @NotNull
    private FileType fileType;
}
