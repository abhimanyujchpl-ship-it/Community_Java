package com.communityapp.modules.notifications.repository;

import com.communityapp.modules.notifications.entity.Notification;
import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.users.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    Page<Notification> findByUserAndIsReadOrderByCreatedAtDesc(User user, boolean isRead, Pageable pageable);

    List<Notification> findTop5ByUserAndCommunityOrderByCreatedAtDesc(User user, Community community);

    long countByUserAndIsReadFalse(User user);

    long countByUserAndCommunityAndIsReadFalse(User user, Community community);
}
