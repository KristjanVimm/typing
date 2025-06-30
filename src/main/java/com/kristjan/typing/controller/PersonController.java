package com.kristjan.typing.controller;

import com.kristjan.typing.dto.PersonDTO;
import com.kristjan.typing.entity.*;
import com.kristjan.typing.model.AuthToken;
import com.kristjan.typing.model.EmailPassword;
import com.kristjan.typing.repository.LessonRepository;
import com.kristjan.typing.repository.PersonRepository;
import com.kristjan.typing.repository.PreferenceRepository;
import com.kristjan.typing.repository.StatisticsRepository;
import com.kristjan.typing.service.PersonService;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Log4j2
public class PersonController {
    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    PersonService personService;
    @Autowired
    PersonRepository personRepository;
    @Autowired
    PreferenceRepository preferenceRepository;
    @Autowired
    ModelMapper modelMapper;
    @Autowired
    StatisticsRepository statisticsRepository;

    @PostMapping("login")
    public AuthToken login(@RequestBody EmailPassword emailPassword) {
        log.info("Trying to log in");
        return personService.getToken(emailPassword);
    }

    @PostMapping("signup")
    public PersonDTO signup(@RequestBody Person person) {
        log.info("Trying to sign up... ID: {}", person.getId());
        personRepository.save(person);
        Preference preference = new Preference(person);
        Lesson lesson = new Lesson("", person);
        lessonRepository.save(lesson);
        preference.setCurrentLessonId(lesson.getId());
        preference.setWantCommonWords(true);
        preferenceRepository.save(preference);
        Statistics statistics = new Statistics(person);
        statisticsRepository.save(statistics);
        return modelMapper.map(person, PersonDTO.class);
    }

    @GetMapping("public-persons")
    public List<PersonDTO> publicPersons() {
        log.info("Fetching public persons");
        return personService.getPersonDTOs();
    }

    @GetMapping("person")
    public Person getPerson() {
        log.info("Fetching person by token");
        Long id = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        return personRepository.findById(id).orElseThrow();
    }

    @PatchMapping("person-admin")
    public Page<Person> changePersonAdmin(@RequestParam Long personId, boolean isAdmin, Pageable pageable) {
        Person person = personRepository.findById(personId).orElseThrow();
        if (isAdmin) {
            person.setRole(PersonRole.ADMIN);
        } else {
            person.setRole(PersonRole.BASIC_USER);
        }
        return personRepository.findAll(pageable);
    }

}
