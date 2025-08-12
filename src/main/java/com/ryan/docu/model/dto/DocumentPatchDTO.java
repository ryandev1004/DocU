package com.ryan.docu.model.dto;

import com.ryan.docu.model.enums.Format;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class DocumentPatchDTO {
    private String title;
    private String name;
    private String professorName;
    private String classTitle;
    private String instituteName;
    private String bodyText;
    private String date;
    private List<String> citations = new ArrayList<>();
    private Format format;
}
