package com.kristjan.typing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.log4j.Log4j;
import lombok.extern.log4j.Log4j2;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Log4j2
@Entity
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 1000000)
    private String text;
    private int bookmark;
    @ManyToOne
    private Person person;

//    public Lesson() {
//        this.text = "This is the teext I want to use as a placeholder for now.";
//    }

    public Lesson(String text, Person person) {
        this.text = text;
        this.bookmark = 0;
        this.person = person;
    }
}
