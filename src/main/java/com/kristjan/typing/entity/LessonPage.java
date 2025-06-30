package com.kristjan.typing.entity;

import jakarta.persistence.*;
import lombok.extern.log4j.Log4j2;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Log4j2
@Entity
public class LessonPage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Lesson lesson;
    private Long duration;
    private int mistakes;
    private int backspaces;
    @Column(length = 100000)
    private String baseText;
    @Column(length = 100000)
    private String typedText;
//    private HashMap<Character, Integer> mistakesMap;
//    private HashMap<Character, Integer> correctsMap;

}
