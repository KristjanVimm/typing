package com.kristjan.typing.dto;

import com.kristjan.typing.entity.Person;
import lombok.Data;

@Data
public class LessonDTO {
    private String text;
    private Long personId;
}
