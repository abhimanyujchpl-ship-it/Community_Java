package com.communityapp.common.exception;

import java.time.Instant;
import java.util.Map;

public record ApiError(
        String message,
        String path,
        int status,
        Map<String, String> errors,
        Instant timestamp
) {
}
