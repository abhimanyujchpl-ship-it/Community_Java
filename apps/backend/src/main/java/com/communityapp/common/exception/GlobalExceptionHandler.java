package com.communityapp.common.exception;

import com.communityapp.common.response.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.TypeMismatchException;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataAccessException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private final Environment environment;

    public GlobalExceptionHandler(Environment environment) {
        this.environment = environment;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(ResourceNotFoundException exception) {
        return buildError(exception.getMessage(), "RESOURCE_NOT_FOUND", HttpStatus.NOT_FOUND, Map.of());
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicate(DuplicateResourceException exception) {
        return buildError(exception.getMessage(), "DUPLICATE_RESOURCE", HttpStatus.CONFLICT, Map.of());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidCredentials(InvalidCredentialsException exception) {
        return buildError(exception.getMessage(), "INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED, Map.of());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(BadRequestException exception) {
        return buildError(exception.getMessage(), "BAD_REQUEST", HttpStatus.BAD_REQUEST, Map.of());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException exception) {
        return buildError("Access denied", "ACCESS_DENIED", HttpStatus.FORBIDDEN, Map.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();

        for (FieldError error : exception.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        return buildError("Validation failed", "VALIDATION_ERROR", HttpStatus.BAD_REQUEST, errors);
    }

    @ExceptionHandler({MethodArgumentTypeMismatchException.class, TypeMismatchException.class})
    public ResponseEntity<ApiErrorResponse> handleTypeMismatch(Exception exception) {
        return buildError("Invalid request parameter or path variable", "INVALID_REQUEST_VALUE", HttpStatus.BAD_REQUEST, Map.of());
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiErrorResponse> handleMissingRequestParameter(MissingServletRequestParameterException exception) {
        return buildError("Missing required request parameter", "MISSING_REQUEST_PARAMETER", HttpStatus.BAD_REQUEST, Map.of(
                exception.getParameterName(),
                "Parameter is required"
        ));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getConstraintViolations().forEach(violation ->
                errors.put(violation.getPropertyPath().toString(), violation.getMessage()));
        return buildError("Validation failed", "VALIDATION_ERROR", HttpStatus.BAD_REQUEST, errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleUnreadableMessage(HttpMessageNotReadableException exception) {
        return buildError("Invalid request body. Check JSON syntax, enum values, UUIDs, and date formats.", "INVALID_REQUEST_BODY", HttpStatus.BAD_REQUEST, Map.of());
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ApiErrorResponse> handleDatabase(DataAccessException exception, HttpServletRequest request) {
        log.error("Database error on {} {}", request.getMethod(), request.getRequestURI(), exception);
        return buildError("Database operation failed", "DATABASE_ERROR", HttpStatus.INTERNAL_SERVER_ERROR, Map.of());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnhandled(Exception exception, HttpServletRequest request) {
        log.error("Unhandled error on {} {}", request.getMethod(), request.getRequestURI(), exception);
        String message = isProd() ? "Unexpected server error" : exception.getMessage();
        return buildError(message, "INTERNAL_SERVER_ERROR", HttpStatus.INTERNAL_SERVER_ERROR, Map.of());
    }

    private ResponseEntity<ApiErrorResponse> buildError(String message, String errorCode, HttpStatus status, Map<String, String> errors) {
        return ResponseEntity.status(status)
                .body(ApiErrorResponse.of(message, errorCode, errors));
    }

    private boolean isProd() {
        return Arrays.asList(environment.getActiveProfiles()).contains("prod");
    }
}
