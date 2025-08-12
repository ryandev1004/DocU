package com.ryan.docu.service;

import com.ryan.docu.mapper.DocumentMapper;
import com.ryan.docu.model.Document;
import com.ryan.docu.model.User;
import com.ryan.docu.model.dto.DocumentCreateDTO;
import com.ryan.docu.model.dto.DocumentDTO;
import com.ryan.docu.model.dto.DocumentListDTO;
import com.ryan.docu.model.enums.FileType;
import com.ryan.docu.repo.DocumentRepo;
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
    private final PdfGeneratorService pdfGeneratorService;

    /**
     * The main method of generation supported by helper methods provided in other service classes.
     *
     * @param userID        The user's unique ID
     * @param document      A parameter passed in by the user's input that carries information to be stored in our doc.
     * @return              Byte code that allows the user to download their document without taking up space in the DB.
     */
    public byte[] generateDocument(UUID userID, DocumentCreateDTO document) throws IOException {
        User user = userService.findEntityById(userID);
        Document generatedDoc = documentMapper.fromCreateDTO(document);
        generatedDoc.setRelatedUser(user);
        byte[] documentBytes = null;
        if (user != null) {
            if (document.getFileType().equals(FileType.PDF)) {
                documentBytes = pdfGeneratorService.generatePDF(document);
            } else if (document.getFileType().equals(FileType.DOCX)) {
                System.out.println("NOT READY YET: DOCX generation is not implemented.");
            }
            documentRepo.save(generatedDoc);
            return documentBytes;
        } else {
            throw new IllegalArgumentException("User not found");
        }
    }

    /**
     * This method loads a document for a user based on the user's ID and the document's ID.
     * It retrieves the document from the repository, generates it in PDF format, and returns the byte array.
     *
     * @param userID       The user's unique ID
     * @param documentId   The document's unique ID
     * @return             Byte code that allows the user to download their document without taking up space in the DB.
     */
    public byte[] loadDocument(UUID userID, UUID documentId) throws IOException {
        User user = userService.findEntityById(userID);
        if (user != null) {
            Document document = documentRepo.findById(documentId).orElse(null);
            assert document != null;
            if (document.getRelatedUser().getUsername().equals(user.getUsername())) {
                DocumentCreateDTO documentInfo = documentMapper.toCreateDTO(document);
                byte[] documentBytes = null;
                if (documentInfo.getFileType().equals(FileType.PDF)) {
                    documentBytes = pdfGeneratorService.generatePDF(documentInfo);
                } else if (documentInfo.getFileType().equals(FileType.DOCX)) {
                    System.out.println("NOT READY YET: DOCX generation is not implemented.");
                }
                return documentBytes;
            } else {
                throw new IllegalArgumentException("Document does not belong to the user");
            }
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

    // Pass only documentId do a findById from the documentRepo and then validate that the userId attached
    // matches authenticated user [COME BACK TO AFTER SECURITY IMPLEMENTATION]
    //    public DocumentDTO updateDocument(UUID userId, UUID documentID, DocumentPatchDTO documentPatch) {
    //        User user = userService.findEntityById(userId);
    //        if (user != null) {
    //            Document document = documentRepo.findByRelatedUserAndDocId(user, documentID);
    //            if (document == null) {
    //                throw new IllegalArgumentException("Document not found");
    //            }
    //            documentMapper.partialUpdate(documentPatch, document);
    //            return documentMapper.toDTO(documentRepo.save(document));
    //        } else {
    //            throw new IllegalArgumentException("User not found");
    //        }
    //    }

    // This method retrieves a list of documents related to a specific user.
    // The information being returned will be shown in a list format, which is why we use DocumentListDTO.
    public List<DocumentListDTO> getDocumentList(UUID userID) {
        User user = userService.findEntityById(userID);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        List<Document> documentListDTOS = documentRepo.findByRelatedUser(user);
        return documentListDTOS.stream().map(documentMapper::toListDTO).collect(Collectors.toList());
    }
}
