package com.kristjan.typing.config;

import com.kristjan.typing.interceptor.IdempotencyInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

//    @Autowired
//    IdempotencyInterceptor idempotencyInterceptor;

    private final IdempotencyInterceptor idempotencyInterceptor;

    @Autowired
    public WebConfig(IdempotencyInterceptor idempotencyInterceptor) {
        this.idempotencyInterceptor = idempotencyInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Apply the interceptor to the endpoint you want to make idempotent.
        registry.addInterceptor(idempotencyInterceptor)
                .addPathPatterns("/lesson-page", "/lesson-bookmark");
    }
}