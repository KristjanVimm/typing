package com.kristjan.typing.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class IdempotencyCacheService {

    private final RedisTemplate<String, byte[]> redisTemplate;

    public IdempotencyCacheService(RedisTemplate<String, byte[]> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    // Atomically set the key if it does not exist
    public boolean trySetKey(String key, byte[] placeholder, Duration expiration) {
        // setIfAbsent returns true if the key was successfully set (i.e., it did not exist)
        Boolean success = redisTemplate.opsForValue().setIfAbsent(key, placeholder, expiration);
        return Boolean.TRUE.equals(success);
    }

    public byte[] getResponse(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public void storeKey(String key, byte[] response, Duration expiration) {
        // Store the final response with an expiration time to prevent stale data.
        redisTemplate.opsForValue().set(key, response, expiration);
    }
}

