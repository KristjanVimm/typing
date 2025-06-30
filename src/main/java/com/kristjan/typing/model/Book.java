package com.kristjan.typing.model;

import lombok.Data;

@Data
public class Book {
    private String author;
    private String title;
    private TextDifficulty difficulty;
}
