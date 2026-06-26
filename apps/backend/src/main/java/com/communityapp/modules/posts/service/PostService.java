package com.communityapp.modules.posts.service;

import com.communityapp.common.dto.PageResponse;
import com.communityapp.common.exception.BadRequestException;
import com.communityapp.common.exception.ResourceNotFoundException;
import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.communities.entity.CommunityMemberRole;
import com.communityapp.modules.communities.entity.CommunityMemberStatus;
import com.communityapp.modules.communities.repository.CommunityMemberRepository;
import com.communityapp.modules.communities.repository.CommunityRepository;
import com.communityapp.modules.notifications.service.NotificationService;
import com.communityapp.modules.notifications.entity.NotificationType;
import com.communityapp.modules.posts.dto.CreatePostRequest;
import com.communityapp.modules.posts.dto.PostResponse;
import com.communityapp.modules.posts.dto.RejectPostRequest;
import com.communityapp.modules.posts.dto.UpdatePostRequest;
import com.communityapp.modules.posts.entity.Post;
import com.communityapp.modules.posts.entity.PostStatus;
import com.communityapp.modules.posts.entity.PostType;
import com.communityapp.modules.posts.mapper.PostMapper;
import com.communityapp.modules.posts.repository.PostRepository;
import com.communityapp.modules.users.entity.User;
import com.communityapp.modules.users.entity.UserRole;
import com.communityapp.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;
    private final NotificationService notificationService;

    @Transactional
    public PostResponse create(CreatePostRequest request, UUID authorId) {
        Community community = findCommunity(request.communityId());
        User author = findUser(authorId);
        ensureCanCreatePost(community, author);

        Post post = new Post();
        post.setCommunity(community);
        post.setAuthor(author);
        post.setPostType(request.postType());
        post.setTitle(request.title());
        post.setContent(request.content());
        post.setMediaUrl(request.mediaUrl());
        post.setStatus(PostStatus.PENDING_APPROVAL);

        return postMapper.toResponse(postRepository.save(post));
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> feed(UUID communityId, PostType postType, UUID userId, Pageable pageable) {
        Community community = findCommunity(communityId);
        User user = findUser(userId);
        ensureCanViewCommunityContent(community, user);
        Page<Post> posts = postType == null
                ? postRepository.findByCommunityAndStatusOrderByCreatedAtDesc(community, PostStatus.APPROVED, pageable)
                : postRepository.findByCommunityAndStatusAndPostTypeOrderByCreatedAtDesc(community, PostStatus.APPROVED, postType, pageable);

        return PageResponse.from(posts.map(postMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> myPosts(UUID authorId, Pageable pageable) {
        User author = findUser(authorId);

        return PageResponse.from(postRepository.findByAuthorAndStatusNotOrderByCreatedAtDesc(author, PostStatus.DELETED, pageable)
                .map(postMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PageResponse<PostResponse> pending(UUID communityId, UUID reviewerId, Pageable pageable) {
        Community community = findCommunity(communityId);
        User reviewer = findUser(reviewerId);
        ensureCommunityAdmin(community, reviewer);

        return PageResponse.from(postRepository.findByCommunityAndStatusAndAuthorNotOrderByCreatedAtDesc(
                        community,
                        PostStatus.PENDING_APPROVAL,
                        reviewer,
                        pageable
                )
                .map(postMapper::toResponse));
    }

    @Transactional(readOnly = true)
    public PostResponse getById(UUID id, UUID userId) {
        Post post = findVisiblePost(id);
        User user = findUser(userId);

        boolean isAuthor = post.getAuthor().getId().equals(userId);
        boolean isAdmin = isAppAdmin(user);
        boolean isApproved = post.getStatus() == PostStatus.APPROVED;

        if (!isAuthor && !isAdmin && !isApproved) {
            throw new AccessDeniedException("Post is not available");
        }

        return postMapper.toResponse(post);
    }

    @Transactional
    public PostResponse update(UUID id, UpdatePostRequest request, UUID userId) {
        Post post = findVisiblePost(id);
        ensureAuthor(post, userId);

        if (post.getStatus() == PostStatus.APPROVED) {
            throw new BadRequestException("Approved posts cannot be edited");
        }

        if (request.postType() != null) {
            post.setPostType(request.postType());
        }
        if (request.title() != null) {
            post.setTitle(request.title());
        }
        if (request.content() != null) {
            post.setContent(request.content());
        }
        if (request.mediaUrl() != null) {
            post.setMediaUrl(request.mediaUrl());
        }
        post.setStatus(PostStatus.PENDING_APPROVAL);
        post.setRejectionReason(null);

        return postMapper.toResponse(postRepository.save(post));
    }

    @Transactional
    public PostResponse submit(UUID id, UUID userId) {
        Post post = findVisiblePost(id);
        ensureAuthor(post, userId);

        if (post.getStatus() == PostStatus.APPROVED) {
            throw new BadRequestException("Approved posts cannot be resubmitted");
        }

        post.setStatus(PostStatus.PENDING_APPROVAL);
        post.setRejectionReason(null);
        post.setApprovedAt(null);
        post.setApprovedBy(null);

        return postMapper.toResponse(postRepository.save(post));
    }

    @Transactional
    public PostResponse approve(UUID id, UUID reviewerId) {
        Post post = findVisiblePost(id);
        User reviewer = findUser(reviewerId);
        ensureAdminNotAuthor(post, reviewer);
        ensurePending(post);

        post.setStatus(PostStatus.APPROVED);
        post.setApprovedBy(reviewer);
        post.setApprovedAt(Instant.now());
        post.setRejectionReason(null);
        Post saved = postRepository.save(post);

        notificationService.create(
                post.getAuthor(),
                post.getCommunity(),
                NotificationType.POST_APPROVED,
                "Post approved",
                "Your post \"" + post.getTitle() + "\" was approved.",
                "{\"postId\":\"" + post.getId() + "\",\"communityId\":\"" + post.getCommunity().getId() + "\"}"
        );

        return postMapper.toResponse(saved);
    }

    @Transactional
    public PostResponse reject(UUID id, RejectPostRequest request, UUID reviewerId) {
        Post post = findVisiblePost(id);
        User reviewer = findUser(reviewerId);
        ensureAdminNotAuthor(post, reviewer);
        ensurePending(post);

        post.setStatus(PostStatus.REJECTED);
        post.setApprovedBy(reviewer);
        post.setApprovedAt(Instant.now());
        post.setRejectionReason(request.rejectionReason());
        Post saved = postRepository.save(post);

        notificationService.create(
                post.getAuthor(),
                post.getCommunity(),
                NotificationType.POST_REJECTED,
                "Post rejected",
                "Your post \"" + post.getTitle() + "\" was rejected: " + request.rejectionReason(),
                "{\"postId\":\"" + post.getId() + "\",\"communityId\":\"" + post.getCommunity().getId() + "\"}"
        );

        return postMapper.toResponse(saved);
    }

    @Transactional
    public void delete(UUID id, UUID userId) {
        Post post = findVisiblePost(id);
        User user = findUser(userId);

        if (!post.getAuthor().getId().equals(userId) && !isAppAdmin(user)) {
            throw new AccessDeniedException("Only the author or an admin can delete this post");
        }

        post.setStatus(PostStatus.DELETED);
        postRepository.save(post);
    }

    private void ensureCanCreatePost(Community community, User author) {
        boolean isActiveMember = communityMemberRepository.existsByCommunityAndUserAndStatus(
                community,
                author,
                CommunityMemberStatus.ACTIVE
        );

        if (!isActiveMember) {
            throw new AccessDeniedException("Only approved community members can create posts");
        }
    }

    private void ensureCanViewCommunityContent(Community community, User user) {
        boolean isActiveMember = communityMemberRepository.existsByCommunityAndUserAndStatus(
                community,
                user,
                CommunityMemberStatus.ACTIVE
        );

        if (!isActiveMember && !isAppAdmin(user)) {
            throw new AccessDeniedException("Approved community membership is required");
        }
    }

    private void ensureAuthor(Post post, UUID userId) {
        if (!post.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("Only the author can modify this post");
        }
    }

    private void ensureAdminNotAuthor(Post post, User reviewer) {
        if (!isCommunityAdmin(post.getCommunity(), reviewer)) {
            throw new AccessDeniedException("Only community admins can review posts");
        }
        if (post.getAuthor().getId().equals(reviewer.getId())) {
            throw new AccessDeniedException("Members cannot approve their own posts");
        }
    }

    private void ensurePending(Post post) {
        if (post.getStatus() != PostStatus.PENDING_APPROVAL) {
            throw new BadRequestException("Only pending posts can be reviewed");
        }
    }

    private boolean isAppAdmin(User user) {
        return user.getRole() == UserRole.SUPER_ADMIN
                || user.getRole() == UserRole.COMMUNITY_ADMIN;
    }

    private boolean isCommunityAdmin(Community community, User user) {
        return user.getRole() == UserRole.SUPER_ADMIN
                || communityMemberRepository.existsByCommunityAndUserAndRoleInCommunityAndStatus(
                community,
                user,
                CommunityMemberRole.ADMIN,
                CommunityMemberStatus.ACTIVE
        );
    }

    private Post findVisiblePost(UUID id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        if (post.getStatus() == PostStatus.DELETED) {
            throw new ResourceNotFoundException("Post not found");
        }

        return post;
    }

    private Community findCommunity(UUID id) {
        return communityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Community not found"));
    }

    private User findUser(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
