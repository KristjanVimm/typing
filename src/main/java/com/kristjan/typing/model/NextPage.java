package com.kristjan.typing.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class NextPage {
    private String text;
    private Boolean endOfLesson;
}
