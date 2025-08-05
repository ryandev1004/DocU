package com.ryan.docu.repo;

import com.ryan.docu.model.Document;
import com.ryan.docu.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DocumentRepo extends JpaRepository<Document, UUID> {
    List<Document> findByRelatedUser(User user);
}
