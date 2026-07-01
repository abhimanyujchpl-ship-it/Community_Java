package com.communityapp.config;

import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.communities.entity.CommunityMember;
import com.communityapp.modules.communities.entity.CommunityMemberRole;
import com.communityapp.modules.communities.entity.CommunityMemberStatus;
import com.communityapp.modules.communities.repository.CommunityMemberRepository;
import com.communityapp.modules.communities.repository.CommunityRepository;
import com.communityapp.modules.accessrequests.entity.AccessRequest;
import com.communityapp.modules.accessrequests.entity.AccessRequestStatus;
import com.communityapp.modules.accessrequests.repository.AccessRequestRepository;
import com.communityapp.modules.events.entity.Event;
import com.communityapp.modules.events.entity.EventReminder;
import com.communityapp.modules.events.entity.EventStatus;
import com.communityapp.modules.events.entity.ReminderType;
import com.communityapp.modules.events.repository.EventReminderRepository;
import com.communityapp.modules.events.repository.EventRepository;
import com.communityapp.modules.notifications.entity.Notification;
import com.communityapp.modules.notifications.entity.NotificationType;
import com.communityapp.modules.notifications.repository.NotificationRepository;
import com.communityapp.modules.posts.entity.Post;
import com.communityapp.modules.posts.entity.PostStatus;
import com.communityapp.modules.posts.entity.PostType;
import com.communityapp.modules.posts.repository.PostRepository;
import com.communityapp.modules.users.entity.User;
import com.communityapp.modules.users.entity.UserRole;
import com.communityapp.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@Profile({"dev", "local"})
@RequiredArgsConstructor
public class DevDataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final AccessRequestRepository accessRequestRepository;
    private final PostRepository postRepository;
    private final EventRepository eventRepository;
    private final EventReminderRepository eventReminderRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.sample-password}")
    private String samplePassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        User superAdmin = upsertUser("superadmin@communityconnect.local", "9000000001", "Sample Super Admin", UserRole.SUPER_ADMIN);
        User communityAdmin = upsertUser("admin@communityconnect.local", "9000000002", "Sample Community Admin", UserRole.COMMUNITY_ADMIN);
        User member = upsertUser("member@communityconnect.local", "9000000003", "Sample Member", UserRole.MEMBER);

        Community community = communityRepository.findByNameIgnoreCase("Green Valley Residents")
                .orElseGet(() -> {
                    Community created = new Community();
                    created.setName("Green Valley Residents");
                    created.setDescription("Sample residential community for web and API testing.");
                    created.setLogoUrl("https://example.com/community-logo.png");
                    created.setCity("Pune");
                    created.setState("Maharashtra");
                    created.setCreatedBy(superAdmin);
                    return communityRepository.save(created);
                });

        ensureMembership(community, communityAdmin, CommunityMemberRole.ADMIN);
        ensureMembership(community, member, CommunityMemberRole.MEMBER);
        ensurePendingAccessRequest(community, member, communityAdmin);
        ensurePost(community, communityAdmin, "Water supply maintenance", "Please store water before the Sunday maintenance window.", PostType.ANNOUNCEMENT, PostStatus.APPROVED, communityAdmin);
        ensurePost(community, member, "Weekend clean-up volunteers", "Join us near the clubhouse for a quick clean-up drive.", PostType.GENERAL, PostStatus.APPROVED, communityAdmin);
        ensurePost(community, member, "Security gate update", "Requesting admin approval for the new gate process.", PostType.NEWS, PostStatus.PENDING_APPROVAL, null);
        Event townHall = ensureEvent(community, communityAdmin, "Community town hall", "MEETING", "Quarterly resident discussion and admin Q&A.", "Clubhouse", 2);
        ensureReminder(townHall, "Town hall starts this evening.");
        ensureEvent(community, communityAdmin, "Health camp", "WELLNESS", "Free basic health check-up for residents.", "Main lobby", 7);
        ensureNotification(member, community, NotificationType.ACCESS_REQUEST_APPROVED, "Access approved", "You can now access Green Valley Residents.");
        ensureNotification(member, community, NotificationType.NEW_EVENT, "New event", "Community town hall has been scheduled.");
        ensureNotification(communityAdmin, community, NotificationType.POST_APPROVED, "Post pending review", "A member post is waiting for approval.");
    }

    private User upsertUser(String email, String mobile, String fullName, UserRole role) {
        return userRepository.findByEmail(email)
                .or(() -> userRepository.findByMobile(mobile))
                .map(user -> {
                    user.setEmail(email);
                    user.setMobile(mobile);
                    user.setFullName(fullName);
                    user.setRole(role);
                    user.setPasswordHash(passwordEncoder.encode(samplePassword));
                    return userRepository.save(user);
                })
                .orElseGet(() -> {
                    User user = new User();
                    user.setEmail(email);
                    user.setMobile(mobile);
                    user.setFullName(fullName);
                    user.setRole(role);
                    user.setPasswordHash(passwordEncoder.encode(samplePassword));
                    return userRepository.save(user);
                });
    }

    private void ensureMembership(Community community, User user, CommunityMemberRole role) {
        communityMemberRepository.findByCommunityAndUser(community, user)
                .ifPresentOrElse(member -> {
                    member.setStatus(CommunityMemberStatus.ACTIVE);
                    member.setRoleInCommunity(role);
                    communityMemberRepository.save(member);
                }, () -> {
                    CommunityMember member = new CommunityMember();
                    member.setCommunity(community);
                    member.setUser(user);
                    member.setRoleInCommunity(role);
                    member.setStatus(CommunityMemberStatus.ACTIVE);
                    communityMemberRepository.save(member);
                });
    }

    private void ensurePendingAccessRequest(Community community, User user, User reviewer) {
        boolean exists = accessRequestRepository.findByCommunityAndUserAndStatus(community, user, AccessRequestStatus.PENDING).isPresent();
        if (exists) {
            return;
        }

        AccessRequest request = new AccessRequest();
        request.setCommunity(community);
        request.setUser(user);
        request.setStatus(AccessRequestStatus.PENDING);
        request.setRequestMessage("Please approve my resident access.");
        request.setReviewedBy(reviewer);
        accessRequestRepository.save(request);
    }

    private void ensurePost(Community community, User author, String title, String content, PostType postType, PostStatus status, User approvedBy) {
        boolean exists = postRepository.findByCommunityAndStatusOrderByCreatedAtDesc(community, status).stream()
                .anyMatch(post -> post.getTitle().equalsIgnoreCase(title));
        if (exists) {
            return;
        }

        Post post = new Post();
        post.setCommunity(community);
        post.setAuthor(author);
        post.setTitle(title);
        post.setContent(content);
        post.setPostType(postType);
        post.setStatus(status);
        if (approvedBy != null) {
            post.setApprovedBy(approvedBy);
            post.setApprovedAt(Instant.now());
        }
        postRepository.save(post);
    }

    private Event ensureEvent(Community community, User createdBy, String title, String eventType, String description, String location, int daysFromNow) {
        return eventRepository.findByCommunityOrderByStartDateTimeAsc(community).stream()
                .filter(event -> event.getTitle().equalsIgnoreCase(title))
                .findFirst()
                .orElseGet(() -> {
                    Instant start = Instant.now().plus(daysFromNow, ChronoUnit.DAYS);
                    Event event = new Event();
                    event.setCommunity(community);
                    event.setCreatedBy(createdBy);
                    event.setTitle(title);
                    event.setEventType(eventType);
                    event.setDescription(description);
                    event.setLocation(location);
                    event.setOrganizerName(createdBy.getFullName());
                    event.setStatus(EventStatus.UPCOMING);
                    event.setStartDateTime(start);
                    event.setEndDateTime(start.plus(2, ChronoUnit.HOURS));
                    return eventRepository.save(event);
                });
    }

    private void ensureReminder(Event event, String message) {
        boolean exists = eventReminderRepository.findByEventOrderByReminderDateTimeAsc(event).stream()
                .anyMatch(reminder -> reminder.getMessage().equalsIgnoreCase(message));
        if (exists) {
            return;
        }

        EventReminder reminder = new EventReminder();
        reminder.setEvent(event);
        reminder.setReminderType(ReminderType.ONE_TIME);
        reminder.setReminderDateTime(event.getStartDateTime().minus(6, ChronoUnit.HOURS));
        reminder.setMessage(message);
        eventReminderRepository.save(reminder);
    }

    private void ensureNotification(User user, Community community, NotificationType type, String title, String message) {
        boolean exists = notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .anyMatch(notification -> notification.getTitle().equalsIgnoreCase(title));
        if (exists) {
            return;
        }

        Notification notification = new Notification();
        notification.setUser(user);
        notification.setCommunity(community);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setDataJson("{\"communityId\":\"" + community.getId() + "\"}");
        notificationRepository.save(notification);
    }
}
