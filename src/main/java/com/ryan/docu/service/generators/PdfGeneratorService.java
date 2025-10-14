package com.ryan.docu.service.generators;

import com.ryan.docu.model.dto.DocumentCreateDTO;
import com.ryan.docu.model.enums.Format;
import com.ryan.docu.service.generators.styles.ApaFormatter;
import com.ryan.docu.service.generators.styles.MlaFormatter;
import com.ryan.docu.service.generators.styles.StyleFormatter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PdfGeneratorService {

    private static final float MARGIN = 72; // 1 inch
    private static final float DOUBLE_SPACE = 24;
    private static final float PARAGRAPH_INDENT = 36; // 0.5 inch first line indent
    private static final float FONT_SIZE = 12;
    private static final PDType1Font FONT = new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN);

    private final Map<Format, StyleFormatter> formatters;

    public PdfGeneratorService() {
        formatters = new HashMap<>();
        formatters.put(Format.MLA, new MlaFormatter());
        formatters.put(Format.APA, new ApaFormatter());
    }

    /**
     * Generates a new PDF document based on the provided DocumentCreateDTO.
     */
    public byte[] generatePDF(DocumentCreateDTO document) throws IOException {
        try (PDDocument pdfDocument = new PDDocument()) {
            PDPage page1 = new PDPage();
            pdfDocument.addPage(page1);

            // Write main content to first page
            float finalYPosition;
            try (PDPageContentStream contentStream = new PDPageContentStream(pdfDocument, page1)) {
                contentStream.setFont(FONT, FONT_SIZE);

                float yPosition = page1.getMediaBox().getHeight() - MARGIN;

                // Header numbering
                writeHeaderNumber(contentStream, document, page1, 1);

                // Writes the Header for the Student.
                yPosition = writeStudentInfo(
                        contentStream, document, yPosition, page1.getMediaBox().getWidth());

                // Body text with proper formatting
                if (document.getBodyText() != null
                        && !document.getBodyText().trim().isEmpty()) {
                    finalYPosition = writeBodyText(pdfDocument, contentStream, document, yPosition);
                } else {
                    // Default placeholder if no body text provided
                    yPosition -= DOUBLE_SPACE;
                    contentStream.beginText();
                    contentStream.newLineAtOffset(MARGIN + PARAGRAPH_INDENT, yPosition);
                    contentStream.showText("Your text goes here! Add content to the bodyText field.");
                    contentStream.endText();
                    finalYPosition = yPosition;
                }
            } // contentStream is automatically closed here

            // Add Works Cited page - AFTER the main content stream is closed
            addWorksCitedPage(pdfDocument, document, finalYPosition);

            return convertToByteArray(pdfDocument);
        }
    }

    /**
     * Adds a Works Cited page to the PDF document.
     */
    private void addWorksCitedPage(PDDocument pdfDocument, DocumentCreateDTO document, float lastYPosition)
            throws IOException {
        PDPage lastPage = pdfDocument.getPage(pdfDocument.getNumberOfPages() - 1);

        // Create new page for Works Cited
        PDPage newPage = new PDPage();
        pdfDocument.addPage(newPage);

        try (PDPageContentStream contentStream = new PDPageContentStream(pdfDocument, newPage)) {
            contentStream.setFont(FONT, FONT_SIZE);

            float yPosition = newPage.getMediaBox().getHeight() - MARGIN;
            writeHeaderNumber(contentStream, document, newPage, pdfDocument.getNumberOfPages());
            yPosition -= DOUBLE_SPACE * 2;
            writeWorksCited(document, contentStream, yPosition, document.getFormat());
        }
    }

    /**
     * Writes the body text to the PDF, handling pagination as needed.
     */
    private float writeBodyText(
            PDDocument document, PDPageContentStream contentStream, DocumentCreateDTO doc, float startY)
            throws IOException {
        String bodyText = doc.getBodyText();
        if (bodyText == null || bodyText.trim().isEmpty()) {
            return startY;
        }
        contentStream.setFont(FONT, FONT_SIZE);

        // Split on newlines
        String[] paragraphs = bodyText.split("\n+");

        // Filter out empty paragraphs and trim whitespace
        List<String> validParagraphs = new ArrayList<>();
        for (String paragraph : paragraphs) {
            String trimmed = paragraph.trim();
            if (!trimmed.isEmpty()) {
                validParagraphs.add(trimmed);
            }
        }

        float yPosition = startY - DOUBLE_SPACE;
        PDPage currentPage = document.getPage(0);
        PDPageContentStream currentStream = contentStream;
        boolean isOriginalStream = true;

        for (String paragraph : validParagraphs) {
            // Check if we need a new page
            int estimatedLines =
                    estimateParagraphLines(paragraph, currentPage.getMediaBox().getWidth());
            float estimatedHeight = estimatedLines * DOUBLE_SPACE;

            if (yPosition - estimatedHeight < MARGIN + (DOUBLE_SPACE * 3)) {
                // Close current stream only if it's not the original one
                if (!isOriginalStream) {
                    currentStream.close();
                }

                // Create new page
                PDPage newPage = new PDPage();
                document.addPage(newPage);
                currentPage = newPage;

                // Create new stream for the new page
                currentStream = new PDPageContentStream(document, currentPage);
                currentStream.setFont(FONT, FONT_SIZE);
                isOriginalStream = false;

                // Add header to new page
                writeHeaderNumber(currentStream, doc, currentPage, document.getNumberOfPages());
                yPosition = currentPage.getMediaBox().getHeight() - MARGIN - (DOUBLE_SPACE * 2);
            }

            // Write paragraph
            boolean shouldIndent =
                    doc.getFormat() == Format.MLA || doc.getFormat() == null || doc.getFormat() == Format.APA;
            yPosition = writeParagraph(
                    currentStream,
                    paragraph,
                    yPosition,
                    currentPage.getMediaBox().getWidth(),
                    shouldIndent);
        }

        if (!isOriginalStream) {
            currentStream.close();
        }

        return yPosition;
    }

    private void writeHeaderNumber(
            PDPageContentStream contentStream, DocumentCreateDTO document, PDPage page, int pageNumber)
            throws IOException {
        String name = getValueOrDefault(document.getName(), "[NAME]");
        String lastName = getLastName(name);
        String headerText;

        float pageWidth = page.getMediaBox().getWidth();
        if (document.getFormat() == Format.MLA) {
            headerText = lastName + " " + pageNumber;
        } else {
            headerText = Integer.toString(pageNumber);
        }

        float headerWidth = FONT.getStringWidth(headerText) / 1000 * FONT_SIZE;
        float headerX = pageWidth - MARGIN - headerWidth;
        float headerY = page.getMediaBox().getHeight() - MARGIN + 15;

        contentStream.beginText();
        contentStream.newLineAtOffset(headerX, headerY);
        contentStream.showText(headerText);
        contentStream.endText();
    }

    private float writeStudentInfo(
            PDPageContentStream contentStream, DocumentCreateDTO document, float yPosition, float pageWidth)
            throws IOException {
        Format format = document.getFormat() != null ? document.getFormat() : Format.MLA;
        StyleFormatter formatter = formatters.get(format);

        if (formatter != null) {
            return formatter.writeHeader(contentStream, document, yPosition, pageWidth);
        } else {
            return formatters.get(Format.MLA).writeHeader(contentStream, document, yPosition, pageWidth);
        }
    }

    private void writeWorksCited(DocumentCreateDTO doc, PDPageContentStream contentStream, float startY, Format format)
            throws IOException {
        float yPosition = startY;

        // Works Cited title - centered
        String citationTitle = getCitationTitle(format);
        float pageWidth = 612; // Standard letter width
        float titleWidth = FONT.getStringWidth(citationTitle) / 1000 * FONT_SIZE;
        float centerX = (pageWidth - titleWidth) / 2;

        contentStream.beginText();
        contentStream.newLineAtOffset(centerX, yPosition);
        contentStream.showText(citationTitle);
        contentStream.endText();
        yPosition -= DOUBLE_SPACE * 2;

        // Citation examples
        List<String> citations = doc.getCitations();
        for (String citation : citations) {
            if (citation.length() > 80) { // Rough estimate for line length
                List<String> wrappedLines = wrapText(citation, 612 - (2 * MARGIN), false);
                for (String line : wrappedLines) {
                    contentStream.beginText();
                    contentStream.newLineAtOffset(MARGIN, yPosition);
                    contentStream.showText(line);
                    contentStream.endText();
                    yPosition -= DOUBLE_SPACE;
                }
            } else {
                contentStream.beginText();
                contentStream.newLineAtOffset(MARGIN, yPosition);
                contentStream.showText(citation);
                contentStream.endText();
                yPosition -= DOUBLE_SPACE;
            }
        }
    }

    private String getCitationTitle(Format format) {
        if (format == null) format = Format.MLA;
        StyleFormatter formatter = formatters.get(format);
        return formatter != null ? formatter.getCitationTitle() : "Works Cited";
    }

    private int estimateParagraphLines(String text, float pageWidth) throws IOException {
        float maxWidthFirstLine = pageWidth - (2 * MARGIN) - PARAGRAPH_INDENT;
        float maxWidthRegular = pageWidth - (2 * MARGIN);
        String[] words = text.split("\\s+");

        int lines = 1;
        float currentLineWidth = 0;
        boolean isFirstLine = true;

        for (String word : words) {
            float wordWidth = FONT.getStringWidth(word + " ") / 1000 * FONT_SIZE;
            float currentMaxWidth = isFirstLine ? maxWidthFirstLine : maxWidthRegular;

            if (currentLineWidth + wordWidth > currentMaxWidth) {
                lines++;
                currentLineWidth = wordWidth;
                isFirstLine = false;
            } else {
                currentLineWidth += wordWidth;
            }
        }
        return lines;
    }

    private float writeParagraph(
            PDPageContentStream contentStream, String text, float startY, float pageWidth, boolean indentFirstLine)
            throws IOException {
        float maxWidth = pageWidth - (2 * MARGIN);
        List<String> lines = wrapText(text, maxWidth, indentFirstLine);
        float yPosition = startY;

        for (int i = 0; i < lines.size(); i++) {
            String line = lines.get(i);
            float xPosition = MARGIN;

            if (i == 0 && indentFirstLine) {
                xPosition += PARAGRAPH_INDENT;
            }

            contentStream.beginText();
            contentStream.newLineAtOffset(xPosition, yPosition);
            contentStream.showText(line);
            contentStream.endText();

            yPosition -= DOUBLE_SPACE;
        }
        return yPosition;
    }

    private List<String> wrapText(String text, float maxWidth, boolean hasIndent) throws IOException {
        List<String> lines = new ArrayList<>();
        String[] words = text.split("\\s+");
        StringBuilder currentLine = new StringBuilder();
        boolean isFirstLine = true;

        for (String word : words) {
            String testLine = currentLine.isEmpty() ? word : currentLine + " " + word;
            float effectiveMaxWidth = (isFirstLine && hasIndent) ? maxWidth - PARAGRAPH_INDENT : maxWidth;
            float textWidth = FONT.getStringWidth(testLine) / 1000 * FONT_SIZE;

            if (textWidth <= effectiveMaxWidth) {
                currentLine.append(currentLine.isEmpty() ? word : " " + word);
            } else {
                if (!currentLine.isEmpty()) {
                    lines.add(currentLine.toString());
                    currentLine = new StringBuilder(word);
                } else {
                    lines.add(word);
                }
                isFirstLine = false;
            }
        }

        if (!currentLine.isEmpty()) {
            lines.add(currentLine.toString());
        }
        return lines;
    }

    private String getLastName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty() || fullName.equals("[INSERT NAME]")) {
            return "[NAME]";
        }
        String[] nameParts = fullName.trim().split("\\s+");
        return nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];
    }

    private byte[] convertToByteArray(PDDocument document) throws IOException {
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            document.save(outputStream);
            return outputStream.toByteArray();
        }
    }

    private String getValueOrDefault(String value, String defaultValue) {
        return value != null && !value.trim().isEmpty() ? value : defaultValue;
    }
}