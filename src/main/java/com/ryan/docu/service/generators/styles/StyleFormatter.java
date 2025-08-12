package com.ryan.docu.service.generators.styles;

import com.ryan.docu.model.dto.DocumentCreateDTO;
import org.apache.pdfbox.pdmodel.PDPageContentStream;

import java.io.IOException;

public interface StyleFormatter {
    float writeHeader(PDPageContentStream contentStream, DocumentCreateDTO document, float yPosition, float pageCenter)
            throws IOException;

    String getCitationTitle();
}
