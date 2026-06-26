package com.communityapp.modules.posts.repository;

import com.communityapp.modules.posts.entity.Post;
import com.communityapp.modules.posts.entity.PostStatus;
import com.communityapp.modules.posts.entity.PostType;
import com.communityapp.modules.communities.entity.Community;
import com.communityapp.modules.users.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PostRepository extends JpaRepository<Post, UUID> {

    List<Post> findByCommunityAndStatusOrderByCreatedAtDesc(Community community, PostStatus status);

    Page<Post> findByCommunityAndStatusOrderByCreatedAtDesc(Community community, PostStatus status, Pageable pageable);

    Page<Post> findByCommunityAndStatusAndPostTypeOrderByCreatedAtDesc(Community community, PostStatus status, PostType postType, Pageable pageable);

    List<Post> findTop5ByCommunityAndStatusOrderByCreatedAtDesc(Community community, PostStatus status);

    List<Post> findTop5ByCommunityAndStatusAndPostTypeOrderByCreatedAtDesc(Community community, PostStatus status, PostType postType);

    long countByCommunityAndStatus(Community community, PostStatus status);

    List<Post> findByAuthorAndStatusNotOrderByCreatedAtDesc(User author, PostStatus status);

    Page<Post> findByAuthorAndStatusNotOrderByCreatedAtDesc(User author, PostStatus status, Pageable pageable);

    List<Post> findTop5ByAuthorAndStatusNotOrderByCreatedAtDesc(User author, PostStatus status);

    List<Post> findTop5ByCommunityAndAuthorAndStatusNotOrderByCreatedAtDesc(Community community, User author, PostStatus status);

    List<Post> findByCommunityAndStatusAndAuthorNotOrderByCreatedAtDesc(Community community, PostStatus status, User author);

    Page<Post> findByCommunityAndStatusAndAuthorNotOrderByCreatedAtDesc(Community community, PostStatus status, User author, Pageable pageable);
}
