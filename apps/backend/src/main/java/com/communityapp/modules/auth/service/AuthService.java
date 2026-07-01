package com.communityapp.modules.auth.service;

import com.communityapp.common.exception.DuplicateResourceException;
import com.communityapp.common.exception.InvalidCredentialsException;
import com.communityapp.modules.auth.dto.AuthResponse;
import com.communityapp.modules.auth.dto.LoginRequest;
import com.communityapp.modules.auth.dto.RegisterRequest;
import com.communityapp.modules.users.entity.User;
import com.communityapp.modules.users.entity.UserRole;
import com.communityapp.modules.users.mapper.UserMapper;
import com.communityapp.modules.users.repository.UserRepository;
import com.communityapp.security.JwtService;
import com.communityapp.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        assertUniqueEmailAndMobile(request.email(), request.mobile(), null);

        User user = new User();
        user.setFullName(request.fullName());
        user.setEmail(request.email().toLowerCase());
        user.setMobile(request.mobile());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setGender(request.gender());
        user.setDateOfBirth(request.dateOfBirth());
        user.setAddress(request.address());
        user.setProfilePhotoUrl(request.profilePhotoUrl());
        user.setRole(UserRole.MEMBER);

        User savedUser = userRepository.save(user);
        return buildAuthResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.emailOrMobile().toLowerCase())
                .or(() -> userRepository.findByMobile(request.emailOrMobile()))
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email/mobile or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email/mobile or password");
        }

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        UserPrincipal principal = UserPrincipal.from(user);
        String token = jwtService.generateToken(principal);

        return new AuthResponse(token, "Bearer", jwtService.accessTokenExpiresAt(), userMapper.toResponse(user));
    }

    private void assertUniqueEmailAndMobile(String email, String mobile, java.util.UUID currentUserId) {
        userRepository.findByEmail(email.toLowerCase())
                .filter(user -> !user.getId().equals(currentUserId))
                .ifPresent(user -> {
                    throw new DuplicateResourceException("Email is already registered");
                });

        userRepository.findByMobile(mobile)
                .filter(user -> !user.getId().equals(currentUserId))
                .ifPresent(user -> {
                    throw new DuplicateResourceException("Mobile is already registered");
                });
    }
}
