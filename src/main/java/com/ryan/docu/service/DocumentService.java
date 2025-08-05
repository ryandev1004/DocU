package com.ryan.docu.service;

import com.ryan.docu.mapper.DocumentMapper;
import com.ryan.docu.model.Document;
import com.ryan.docu.model.User;
import com.ryan.docu.model.dto.DocumentCreateDTO;
import com.ryan.docu.model.dto.DocumentDTO;
import com.ryan.docu.model.dto.DocumentListDTO;
import com.ryan.docu.model.enums.FileType;
import com.ryan.docu.repo.DocumentRepo;
import com.ryan.docu.service.generators.DocxGeneratorService;
import com.ryan.docu.service.generators.PdfGeneratorService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepo documentRepo;
    private final DocumentMapper documentMapper;
    private final UserService userService;

    /**
     * The main method of generation supported by helper methods provided in other service classes.
     *
     * @param userID        The user's unique ID
     * @param document      A parameter passed in by the user's input that carries information to be stored in our doc.
     * @return              Byte code that allows the user to download their document without taking up space in the DB.
     * @throws IOException
     */
    public byte[] generateDocument(UUID userID, DocumentCreateDTO document) throws IOException {
        User user = userService.findEntityById(userID);
        Document generatedDoc = documentMapper.fromCreateDTO(document);
        generatedDoc.setRelatedUser(user);
        byte[] documentBytes = null;
        if (user != null) {
            if (document.getFileType().equals(FileType.PDF)) {
                PdfGeneratorService pdfGeneratorService = new PdfGeneratorService();
                documentBytes = pdfGeneratorService.generatePDF(document);
            } else if (document.getFileType().equals(FileType.DOCX)) {
                DocxGeneratorService docxGeneratorService = new DocxGeneratorService();
            }
            documentRepo.save(generatedDoc);
            return documentBytes;
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    // For testing purposes
    public DocumentDTO createDocument(UUID userID, DocumentCreateDTO document) {
        User user = userService.findEntityById(userID);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        Document generatedDoc = documentMapper.fromCreateDTO(document);
        generatedDoc.setRelatedUser(user);
        return documentMapper.toDTO(documentRepo.save(generatedDoc));
    }

    public DocumentDTO getDocument(UUID documentID) {
        return documentMapper.toDTO(documentRepo.findById(documentID).orElse(null));
    }

    public List<DocumentListDTO> getDocumentList(UUID userID) {
        User user = userService.findEntityById(userID);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        List<Document> documentListDTOS = documentRepo.findByRelatedUser(user);
        return documentListDTOS.stream().map(documentMapper::toListDTO).collect(Collectors.toList());
    }
}
