package com.ryan.docu.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ryan.docu.model.enums.FileType;
import com.ryan.docu.model.enums.Format;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
public class Document {

    @Id
    @UuidGenerator
    private UUID docId;

    @Column(nullable = false)
    private String title;

    private String name;
    private String professorName;
    private String classTitle;
    private String instituteName;
    private String date;
    
    private Instant timeCreated;

    @Enumerated(EnumType.STRING)
    private Format format;
    @Enumerated(EnumType.STRING)
    private FileType fileType;

    private String documentLink;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User relatedUser;

    @PrePersist
    public void prePersist() {
        timeCreated = Instant.now();
    }

}
