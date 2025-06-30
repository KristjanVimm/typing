package com.kristjan.typing.filter;

import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingResponseWrapper;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CachingResponseFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        // Wrap the HttpServletResponse so that its content is cached.
        ContentCachingResponseWrapper cachingResponse =
                new ContentCachingResponseWrapper((HttpServletResponse) response);
        chain.doFilter(request, cachingResponse);
        // Ensure that the cached content is copied to the actual response.
        cachingResponse.copyBodyToResponse();
    }
}
