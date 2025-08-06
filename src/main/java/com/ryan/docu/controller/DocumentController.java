package com.ryan.docu.controller;

import com.ryan.docu.model.dto.DocumentCreateDTO;
import com.ryan.docu.model.dto.DocumentDTO;
import com.ryan.docu.model.dto.DocumentListDTO;
import com.ryan.docu.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/document")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/generate/{userId}")
    public ResponseEntity<byte[]> generateDocument(@PathVariable UUID userId, @RequestBody DocumentCreateDTO document)
            throws IOException {
        byte[] documentBytes = documentService.generateDocument(userId, document);

        HttpHeaders headers = new HttpHeaders();
        if (document.getFileType().name().equals("PDF")) {
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", getFileName(document) + ".pdf");
        } else if (document.getFileType().name().equals("DOCX")) {
            return ResponseEntity.ok(null);
        }
        headers.setContentLength(documentBytes.length);

        return ResponseEntity.ok().headers(headers).body(documentBytes);
    }

    @PostMapping("/{userId}")
    public ResponseEntity<DocumentDTO> createDocument(
            @PathVariable UUID userId, @RequestBody DocumentCreateDTO document) {
        return ResponseEntity.ok(documentService.createDocument(userId, document));
    }

    @GetMapping("/{docId}")
    public ResponseEntity<DocumentDTO> getDocument(@PathVariable UUID docId) {
        return ResponseEntity.ok(documentService.getDocument(docId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DocumentListDTO>> getDocuments(@PathVariable UUID userId) {
        return ResponseEntity.ok(documentService.getDocumentList(userId));
    }

    /**
     * Helper method to generate filename from document data
     */
    private String getFileName(DocumentCreateDTO document) {
        if (document.getTitle() != null && !document.getTitle().trim().isEmpty()) {
            // Clean the title for use as filename (remove special characters)
            String cleaned = document.getTitle()
                    .replaceAll("[^a-zA-Z0-9\\s]", "")
                    .replaceAll("\\s+", "_")
                    .trim();
            return cleaned.isEmpty() ? "Document" : cleaned;
        }
        return "Document";
    }
}
