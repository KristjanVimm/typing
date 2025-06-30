package com.kristjan.typing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Preference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private Person person;
    @Setter
    private Long currentLessonId;
    @Setter
    private Boolean wantCommonWords;
    @Setter
    private String customText;
    @Setter
    private int wordsOnPage;
    @Setter
    private TextSize textSize;

    public Preference(Person person) {
        this.person = person;
        this.wordsOnPage = 20;
        this.textSize = TextSize.MEDIUM;
    }
}
