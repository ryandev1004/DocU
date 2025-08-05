package com.ryan.docu.model;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UuidGenerator;


import java.util.List;
import java.util.UUID;

@Data
@Entity
@Table(name = "doc_user")
public class User {

    @Id
    @UuidGenerator
    private UUID userId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;


    @OneToMany(mappedBy = "relatedUser", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Document> documents;
}
