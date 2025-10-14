package com.ryan.docu.service.generators.styles;

import com.ryan.docu.model.dto.DocumentCreateDTO;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class MlaFormatter implements StyleFormatter {

    private static final float MARGIN = 72f; // 1 inch margin
    private static final float DOUBLE_SPACE = 24f; // Double-spacing
    private static final PDType1Font FONT = new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN);
    private static final float FONT_SIZE = 12f;

    @Override
    public float writeHeader(
            PDPageContentStream contentStream, DocumentCreateDTO document, float yPosition, float pageWidth)
            throws IOException {

        // Name of Student
        contentStream.beginText();
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText(getValueOrDefault(document.getName(), "[INSERT NAME]"));
        contentStream.endText();
        yPosition -= DOUBLE_SPACE;

        // Name of Instructor
        contentStream.beginText();
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText(getValueOrDefault(document.getProfessorName(), "[INSERT INSTRUCTOR NAME]"));
        contentStream.endText();
        yPosition -= DOUBLE_SPACE;

        // Class name
        contentStream.beginText();
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText(getValueOrDefault(document.getClassTitle(), "[CLASS NAME]"));
        contentStream.endText();
        yPosition -= DOUBLE_SPACE;

        // Date
        contentStream.beginText();
        contentStream.newLineAtOffset(MARGIN, yPosition);
        contentStream.showText(formatDate(document));
        contentStream.endText();
        yPosition -= DOUBLE_SPACE * 2; // Extra space before title

        // Title (Bolded)
        String title = getValueOrDefault(document.getTitle(), "[TITLE]");
        float titleWidth = FONT.getStringWidth(title) / 1000 * FONT_SIZE;
        float centerX = (pageWidth - titleWidth) / 2;
        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.TIMES_BOLD), FONT_SIZE);
        contentStream.newLineAtOffset(centerX, yPosition);
        contentStream.showText(title);
        contentStream.endText();
        yPosition -= DOUBLE_SPACE;

        return yPosition;
    }

    @Override
    public String getCitationTitle() {
        return "Works Cited";
    }

    /**
     * Helper method to get value or default placeholder
     */
    private String getValueOrDefault(String value, String defaultValue) {
        return (value != null && !value.trim().isEmpty()) ? value : defaultValue;
    }

    /**
     * Format date according to MLA standards (Day Month Year)
     */
    private String formatDate(DocumentCreateDTO document) {
        if (document.getDate() != null && !document.getDate().trim().isEmpty()) {
            // If the date is already formatted, return it
            return document.getDate();
        }
        // If no date provided, use current date in MLA format
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMMM yyyy");
        return currentDate.format(formatter);
    }
}
