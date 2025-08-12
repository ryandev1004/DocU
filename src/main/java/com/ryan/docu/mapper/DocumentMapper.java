package com.ryan.docu.mapper;

import com.ryan.docu.model.Document;
import com.ryan.docu.model.dto.DocumentCreateDTO;
import com.ryan.docu.model.dto.DocumentDTO;
import com.ryan.docu.model.dto.DocumentListDTO;
import com.ryan.docu.model.dto.DocumentPatchDTO;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface DocumentMapper {

    DocumentDTO toDTO(Document document);

    Document fromCreateDTO(DocumentCreateDTO documentCreateDTO);

    DocumentCreateDTO toCreateDTO(Document document);

    DocumentListDTO toListDTO(Document document);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void partialUpdate(DocumentPatchDTO documentPatchDTO, @MappingTarget Document document);
}
