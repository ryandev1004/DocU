package com.ryan.docu.service.generators;

import com.ryan.docu.model.dto.DocumentCreateDTO;
import com.ryan.docu.model.enums.Format;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class PdfGeneratorService {

    private static final String TEMPLATE_BASE_PATH = "templates/";
    private static final float MARGIN = 72;
    private static final float DOUBLE_SPACE = 28;

    public byte[] generatePDF(DocumentCreateDTO documentData) throws IOException {
        try (PDDocument doc = loadTemplate(documentData)) {
            fillTemplate(doc, documentData);
            return convertToByteArray(doc);
        }
    }

    private PDDocument loadTemplate(DocumentCreateDTO data) {
        String templatePath = getTemplatePath(data);
        try {
            // Try to load from classpath (src/main/resources)
            ClassPathResource resource = new ClassPathResource(templatePath);
            if (resource.exists()) {
                try (InputStream inputStream = resource.getInputStream()) {
                    byte[] pdfBytes = inputStream.readAllBytes();
                    return Loader.loadPDF(pdfBytes);
                }
            }
        } catch (IOException e) {
            System.err.println("Could not load template from classpath: " + e.getMessage());
        }
        return createNewDocument();
    }

    private String getTemplatePath(DocumentCreateDTO data) {
        Format format = data.getFormat();
        if (format == null) {
            return TEMPLATE_BASE_PATH + "MLA-Template.pdf";
        }
        return switch (format) {
            case APA -> TEMPLATE_BASE_PATH + "APA-Template.pdf";
            case HARVARD -> TEMPLATE_BASE_PATH + "Harvard-Template.pdf";
            case CHICAGO -> TEMPLATE_BASE_PATH + "Chicago-Template.pdf";
            default -> TEMPLATE_BASE_PATH + "MLA-Template.pdf";
        };
    }

    private PDDocument createNewDocument() {
        PDDocument document = new PDDocument();
        PDPage page = new PDPage();
        document.addPage(page);
        return document;
    }

    /**
     * Fills the template with data from DocumentCreateDTO
     * @param document The PDF document to fill
     * @param data The data to insert
     * @throws IOException if writing to PDF fails
     */
    private void fillTemplate(PDDocument document, DocumentCreateDTO data) throws IOException {
        // Process all pages in the document
        for (int pageIndex = 0; pageIndex < document.getNumberOfPages(); pageIndex++) {
            PDPage page = document.getPage(pageIndex);
            try (PDPageContentStream contentStream = new PDPageContentStream(
                    document, page, PDPageContentStream.AppendMode.APPEND, true, true)) { // Changed to APPEND

                // Set font for the document
                contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN), 12);

                if (pageIndex == 0) {
                    // First page - add header and title
                    float yPosition = page.getMediaBox().getHeight() - MARGIN;

                    // Update the header numbering (replace [NAME] 1 with actual name)
                    updateHeaderNumbering(contentStream, data, page, pageIndex + 1);

                    // Header (top-left corner)
                    yPosition = writeHeader(contentStream, data, yPosition);

                    // Title (centered)
                    writeTitle(
                            contentStream, data, yPosition, page.getMediaBox().getWidth());
                } else {
                    // Other pages - just update header numbering
                    updateHeaderNumbering(contentStream, data, page, pageIndex + 1);
                }
            }
        }
    }

    /**
     * Updates the header numbering to replace [NAME] with actual name
     */
    private void updateHeaderNumbering(
            PDPageContentStream contentStream, DocumentCreateDTO data, PDPage page, int pageNumber) throws IOException {
        String name = getValueOrDefault(data.getName(), "[INSERT NAME]");
        String lastName = getLastName(name);

        // Position for header numbering (top-right corner)
        float pageWidth = page.getMediaBox().getWidth();
        String headerText = lastName + " " + pageNumber;

        float headerWidth =
                new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN).getStringWidth(headerText) / 1000 * 12;
        float headerX = pageWidth - MARGIN - headerWidth;
        float headerY = page.getMediaBox().getHeight() - MARGIN + 15; // Slightly above the margin

        contentStream.beginText();
        contentStream.newLineAtOffset(headerX, headerY);
        contentStream.showText(headerText);
        contentStream.endText();
    }

    /**
     * Extracts last name from full name
     */
    private String getLastName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty() || fullName.equals("[INSERT NAME]")) {
            return "[NAME]";
        }

        String[] nameParts = fullName.trim().split("\\s+");
        return nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
    }

    private float writeHeader(PDPageContentStream contentStream, DocumentCreateDTO data, float yPosition)
            throws IOException {
        // Name
        contentStream.beginText();
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText(getValueOrDefault(data.getName(), "[INSERT NAME]"));
        contentStream.endText();
        yPosition -= DOUBLE_SPACE;

        // Instructor Name
        contentStream.beginText();
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText(getValueOrDefault(data.getProfessorName(), "[INSERT INSTRUCTOR NAME]"));
        contentStream.endText();
        yPosition -= DOUBLE_SPACE;

        // Class Name
        contentStream.beginText();
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText(getValueOrDefault(data.getClassTitle(), "[CLASS NAME]"));
        contentStream.endText();
        yPosition -= DOUBLE_SPACE;

        // Date
        contentStream.beginText();
        contentStream.newLineAtOffset(MARGIN, yPosition);
        String dateStr = getValueOrDefault(data.getDate(), "[DATE]");
        contentStream.showText(dateStr);
        contentStream.endText();
        yPosition -= DOUBLE_SPACE * 2; // Extra space before title

        return yPosition;
    }

    /**
     * Writes the centered title
     */
    private void writeTitle(PDPageContentStream contentStream, DocumentCreateDTO data, float yPosition, float pageWidth)
            throws IOException {
        String title = getValueOrDefault(data.getTitle(), "[TITLE]");

        // Calculate center position
        float titleWidth = new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN).getStringWidth(title) / 1000 * 12;
        float centerX = (pageWidth - titleWidth) / 2;

        contentStream.beginText();
        contentStream.newLineAtOffset(centerX, yPosition);
        contentStream.showText(title);
        contentStream.endText();
    }

    /**
     * Converts PDDocument to bytearray
     */
    private byte[] convertToByteArray(PDDocument document) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    /**
     * Helper method to provide default values for null fields
     */
    private String getValueOrDefault(String value, String defaultValue) {
        return value != null && !value.trim().isEmpty() ? value : defaultValue;
    }
}