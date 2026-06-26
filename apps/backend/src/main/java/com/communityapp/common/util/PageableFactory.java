package com.communityapp.common.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PageableFactory {

    private static final int MAX_PAGE_SIZE = 100;

    private PageableFactory() {
    }

    public static Pageable create(int page, int size, Sort sort) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.max(1, Math.min(size, MAX_PAGE_SIZE));
        return PageRequest.of(safePage, safeSize, sort);
    }
}
