package com.kristjan.typing.interceptor;

import com.kristjan.typing.service.IdempotencyCacheService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.util.ContentCachingResponseWrapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.time.Duration;
import java.util.Arrays;

@Log4j2
@Component
public class IdempotencyInterceptor implements HandlerInterceptor {

    // In-memory cache for demonstration purposes.
    // In production, consider using a persistent or distributed cache.
//    @Autowired
//    IdempotencyCacheService idempotencyCacheService;

    private final IdempotencyCacheService idempotencyCacheService;
    // Define a placeholder value (could be any byte array, here we use a simple string)
    private static final byte[] PROCESSING_PLACEHOLDER = "processing".getBytes();
    // Set an expiration for the lock/placeholder (e.g., 1 minute)
    private static final Duration LOCK_EXPIRATION = Duration.ofSeconds(1);
    // Set an expiration for the final cached response (e.g., 1 hour)
    private static final Duration RESPONSE_EXPIRATION = Duration.ofSeconds(5);

    public IdempotencyInterceptor(IdempotencyCacheService idempotencyCacheService) {
        this.idempotencyCacheService = idempotencyCacheService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String idempotencyKey = request.getHeader("Idempotency-Key");
        log.info("idempotency-key as given: " + idempotencyKey);
        if (idempotencyKey != null) {
            // Atomically attempt to set the key with a placeholder
            boolean isNewRequest = idempotencyCacheService.trySetKey(idempotencyKey, PROCESSING_PLACEHOLDER, LOCK_EXPIRATION);
            if (!isNewRequest) {
                log.info("The key already exists, prematurely returning false.");
                return false;
            }
        }
        log.info("key was new, proceeding as usual");
        return true; // Proceed if the key was set or if no key was provided.
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) throws Exception {
        String idempotencyKey = request.getHeader("Idempotency-Key");
        if (idempotencyKey != null && response instanceof ContentCachingResponseWrapper) {
            ContentCachingResponseWrapper cachingResponse = (ContentCachingResponseWrapper) response;
            byte[] content = cachingResponse.getContentAsByteArray();
            // Replace the placeholder with the actual response content atomically.
            idempotencyCacheService.storeKey(idempotencyKey, content, RESPONSE_EXPIRATION);
            cachingResponse.copyBodyToResponse();
        }
    }
}
