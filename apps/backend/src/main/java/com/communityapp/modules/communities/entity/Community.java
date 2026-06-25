package com.communityapp.modules.communities.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import com.communityapp.modules.users.entity.User;

import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@Table(name = "communities")
public class Community {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    private String description;

    private String logoUrl;

    private String city;

    private String state;

    @Enumerated(EnumType.STRING)
    private CommunityStatus status = CommunityStatus.ACTIVE;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    private Instant createdAt;

    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }
}
