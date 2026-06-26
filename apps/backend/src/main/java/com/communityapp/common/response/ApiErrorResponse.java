package com.communityapp.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.Map;

public record ApiErrorResponse(
        boolean success,
        String message,
        String errorCode,
        @JsonInclude(JsonInclude.Include.NON_EMPTY)
        Map<String, String> errors
) {

    public static ApiErrorResponse of(String message, String errorCode, Map<String, String> errors) {
        return new ApiErrorResponse(false, message, errorCode, errors);
    }
}
