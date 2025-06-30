package com.kristjan.typing.controller;

import com.kristjan.typing.dto.PreferenceDTO;
import com.kristjan.typing.entity.Person;
import com.kristjan.typing.entity.Preference;
import com.kristjan.typing.repository.PersonRepository;
import com.kristjan.typing.repository.PreferenceRepository;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@Log4j2
@RestController
public class PreferenceController {

    @Autowired
    private PersonRepository personRepository;
    @Autowired
    PreferenceRepository preferenceRepository;
    @Autowired
    ModelMapper modelMapper;

    @GetMapping("preference")
    public Preference getPreference() {
        log.info("Fetching preference by token");
        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        return preferenceRepository.findByPerson_Id(personId);
    }

    @PutMapping("preference")
    public Preference putPreference(@RequestBody Preference preference) {
        log.info("Trying to PUT preference");

        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );

        if (!personId.equals(preference.getPerson().getId())) {
            throw new RuntimeException("Trying to change preferences of another person's account");
        }

        Preference preferenceDB = preferenceRepository.findById(preference.getId()).orElseThrow();
        preferenceDB.setTextSize(preference.getTextSize());
        preferenceDB.setWordsOnPage(preference.getWordsOnPage());
        Person personDB = personRepository.findById(preference.getPerson().getId()).orElseThrow();
        personDB.setFirstName(preference.getPerson().getFirstName());
        personDB.setLastName(preference.getPerson().getLastName());
        personRepository.save(personDB);
        return preferenceRepository.save(preferenceDB);
    }

    @PatchMapping("preference")
    public PreferenceDTO updateCustomText(@RequestBody String customText) {
        Long personId = Long.parseLong(
                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString()
        );
        Preference preferenceDB = preferenceRepository.findByPerson_Id(personId);
        preferenceDB.setCustomText(customText);
        preferenceRepository.save(preferenceDB);
        return modelMapper.map(preferenceDB, PreferenceDTO.class);
    }

}
