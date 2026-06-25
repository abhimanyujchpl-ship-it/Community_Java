package com.communityapp.modules.users.mapper;

import com.communityapp.modules.users.dto.UserResponse;
import com.communityapp.modules.users.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getMobile(),
                user.getGender(),
                user.getDateOfBirth(),
                user.getAddress(),
                user.getCity(),
                user.getState(),
                user.getOccupation(),
                user.getProfilePhotoUrl(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
