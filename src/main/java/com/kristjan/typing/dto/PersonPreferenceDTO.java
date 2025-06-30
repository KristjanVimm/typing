package com.kristjan.typing.dto;

import com.kristjan.typing.entity.Person;
import com.kristjan.typing.entity.Preference;
import lombok.Data;

@Data
public class PersonPreferenceDTO {
    private Person person;
    private Preference preference;
}
