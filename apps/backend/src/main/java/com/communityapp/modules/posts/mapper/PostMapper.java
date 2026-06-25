package com.communityapp.modules.posts.mapper;

import com.communityapp.modules.communities.mapper.CommunityMapper;
import com.communityapp.modules.posts.dto.PostResponse;
import com.communityapp.modules.posts.entity.Post;
import com.communityapp.modules.users.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostMapper {

    private final CommunityMapper communityMapper;
    private final UserMapper userMapper;

    public PostResponse toResponse(Post post) {
        return new PostResponse(
                post.getId(),
                communityMapper.toResponse(post.getCommunity()),
                userMapper.toResponse(post.getAuthor()),
                post.getPostType(),
                post.getTitle(),
                post.getContent(),
                post.getMediaUrl(),
                post.getStatus(),
                post.getRejectionReason(),
                post.getApprovedBy() != null ? userMapper.toResponse(post.getApprovedBy()) : null,
                post.getApprovedAt(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
