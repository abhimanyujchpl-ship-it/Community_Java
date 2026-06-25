package com.communityapp.modules.users.service;

import com.communityapp.common.exception.DuplicateResourceException;
import com.communityapp.common.exception.ResourceNotFoundException;
import com.communityapp.modules.users.dto.UpdateUserRequest;
import com.communityapp.modules.users.dto.UserResponse;
import com.communityapp.modules.users.entity.User;
import com.communityapp.modules.users.mapper.UserMapper;
import com.communityapp.modules.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getById(UUID id) {
        return userMapper.toResponse(findEntityById(id));
    }

    @Transactional
    public UserResponse update(UUID id, UpdateUserRequest request) {
        User user = findEntityById(id);

        if (request.email() != null) {
            String email = request.email().toLowerCase();
            userRepository.findByEmail(email)
                    .filter(existing -> !existing.getId().equals(id))
                    .ifPresent(existing -> {
                        throw new DuplicateResourceException("Email is already registered");
                    });
            user.setEmail(email);
        }

        if (request.mobile() != null) {
            userRepository.findByMobile(request.mobile())
                    .filter(existing -> !existing.getId().equals(id))
                    .ifPresent(existing -> {
                        throw new DuplicateResourceException("Mobile is already registered");
                    });
            user.setMobile(request.mobile());
        }

        if (request.fullName() != null) {
            user.setFullName(request.fullName());
        }
        if (request.gender() != null) {
            user.setGender(request.gender());
        }
        if (request.dateOfBirth() != null) {
            user.setDateOfBirth(request.dateOfBirth());
        }
        if (request.address() != null) {
            user.setAddress(request.address());
        }
        if (request.city() != null) {
            user.setCity(request.city());
        }
        if (request.state() != null) {
            user.setState(request.state());
        }
        if (request.occupation() != null) {
            user.setOccupation(request.occupation());
        }
        if (request.profilePhotoUrl() != null) {
            user.setProfilePhotoUrl(request.profilePhotoUrl());
        }

        return userMapper.toResponse(userRepository.save(user));
    }

    private User findEntityById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
