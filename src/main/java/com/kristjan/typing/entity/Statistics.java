package com.kristjan.typing.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
public class Statistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private Person person;
    private Integer numWordsTyped;
    private Long numMillisecondsTyped;
    private Double speed;
    private Long numCharactersTyped;
    private Long numMistakes;
    private Double accuracy;
//    private HashMap<Character, Integer> mistakesMap;
//    private HashMap<Character, Integer> correctsMap;

    public Statistics(Person person) {
        this.person = person;
        this.numWordsTyped = 0;
        this.numMillisecondsTyped = 0L;
        this.speed = 0.0;
        this.numCharactersTyped = 0L;
        this.numMistakes = 0L;
        this.accuracy = 0.0;
//        this.mistakesMap = new HashMap<>();
//        this.correctsMap = new HashMap<>();
    }
}
