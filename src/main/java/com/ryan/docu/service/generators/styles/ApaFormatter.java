package com.ryan.docu.service.generators.styles;

import com.ryan.docu.model.dto.DocumentCreateDTO;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ApaFormatter implements StyleFormatter {

    private static final float DOUBLE_SPACE = 24f; // Double-spacing
    private static final PDType1Font FONT = new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN);
    private static final float FONT_SIZE = 12f;

    @Override
    public float writeHeader(
            PDPageContentStream contentStream, DocumentCreateDTO document, float yPosition, float pageWidth)
            throws IOException {
        float centerX = pageWidth / 2;

        // Start from upper third of the page for title page elements
        float startY = yPosition - (DOUBLE_SPACE * 4); // Move down from top

        // Paper Title (centered)
        String title = getValueOrDefault(document.getTitle(), "[PAPER TITLE]");
        float titleWidth = textWidth(title);
        contentStream.beginText();
        contentStream.setFont(new PDType1Font(Standard14Fonts.FontName.TIMES_BOLD), FONT_SIZE);
        contentStream.newLineAtOffset(centerX - (titleWidth / 2), startY);
        contentStream.showText(title);
        contentStream.endText();
        startY -= DOUBLE_SPACE * 2;

        // Author Name(s) - centered
        String authorName = getValueOrDefault(document.getName(), "[AUTHOR NAME]");
        float authorWidth = FONT.getStringWidth(authorName) / 1000 * FONT_SIZE;
        contentStream.beginText();
        contentStream.setFont(FONT, FONT_SIZE);
        contentStream.newLineAtOffset(centerX - (authorWidth / 2), startY);
        contentStream.showText(authorName);
        contentStream.endText();
        startY -= DOUBLE_SPACE;

        // Institutional Affiliation - centered
        String institution = getValueOrDefault(document.getInstituteName(), "[INSTITUTIONAL AFFILIATION]");
        float institutionWidth = FONT.getStringWidth(institution) / 1000 * FONT_SIZE;
        contentStream.beginText();
        contentStream.newLineAtOffset(centerX - (institutionWidth / 2), startY);
        contentStream.showText(institution);
        contentStream.endText();
        startY -= DOUBLE_SPACE; // Extra space before course info

        // Course Information section
        String courseInfo = getValueOrDefault(document.getClassTitle(), "[COURSE NAME]");
        float courseWidth = textWidth(courseInfo);
        contentStream.beginText();
        contentStream.newLineAtOffset(centerX - (courseWidth / 2), startY);
        contentStream.showText(courseInfo);
        contentStream.endText();
        startY -= DOUBLE_SPACE;

        // Instructor Name
        String instructor = getValueOrDefault(document.getProfessorName(), "[INSTRUCTOR NAME]");
        float instructorWidth = textWidth(instructor);
        contentStream.beginText();
        contentStream.newLineAtOffset(centerX - (instructorWidth / 2), startY);
        contentStream.showText(instructor);
        contentStream.endText();
        startY -= DOUBLE_SPACE;

        // Due Date (APA format: Month Day, Year)
        String formattedDate = formatDate(document);
        float dateWidth = textWidth(formattedDate);
        contentStream.beginText();
        contentStream.newLineAtOffset(centerX - (dateWidth / 2), startY);
        contentStream.showText(formattedDate);
        contentStream.endText();

        // Return position for next page content (APA typically starts content on page 2)
        return startY - (DOUBLE_SPACE * 8);
    }

    @Override
    public String getCitationTitle() {
        return "References";
    }

    @Override
    public String[] getCitationExamples() {
        return new String[] {
            "Author, A. A. (Year). Title of work. Publisher.",
            "Author, A. A., & Author, B. B. (Year). Title of article. Journal Name, Volume(Issue), pages.",
            "Website Author. (Year, Month Day). Title of page. Site Name. URL"
        };
    }

    /**
     * Helper method to get value or default placeholder
     */
    private String getValueOrDefault(String value, String defaultValue) {
        return (value != null && !value.trim().isEmpty()) ? value : defaultValue;
    }

    /**
     * Helper method to reduce boilerplate code.
     */
    private float textWidth(String text) throws IOException {
        return FONT.getStringWidth(text) / 1000 * FONT_SIZE;
    }

    /**
     * Format date according to APA standards (Month Day, Year)
     * Example: March 15, 2024
     */
    private String formatDate(DocumentCreateDTO document) {
        if (document.getDate() != null && !document.getDate().trim().isEmpty()) {
            // If the date is already formatted, return it
            return document.getDate();
        }
        // If no date provided, use current date in APA format
        LocalDate currentDate = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM d, yyyy");
        return currentDate.format(formatter);
    }
}