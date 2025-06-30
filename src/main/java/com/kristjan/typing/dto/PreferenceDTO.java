package com.kristjan.typing.dto;

import com.kristjan.typing.entity.TextSize;
import lombok.Data;

@Data
public class PreferenceDTO {
    private Long id;
    private String lastLesson;
    private String customText;
    private int wordsOnPage;
    private TextSize textSize;
}