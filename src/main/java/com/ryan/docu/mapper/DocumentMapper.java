package com.ryan.docu.mapper;

import com.ryan.docu.model.Document;
import com.ryan.docu.model.dto.DocumentCreateDTO;
import com.ryan.docu.model.dto.DocumentDTO;
import com.ryan.docu.model.dto.DocumentListDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface DocumentMapper {

    DocumentDTO toDTO(Document document);

    Document fromCreateDTO(DocumentCreateDTO documentCreateDTO);

    DocumentCreateDTO toCreateDTO(Document document);

    DocumentListDTO toListDTO(Document document);
}
