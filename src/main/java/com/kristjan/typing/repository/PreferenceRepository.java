package com.kristjan.typing.repository;

import com.kristjan.typing.entity.Preference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreferenceRepository extends JpaRepository<Preference, Long> {

    Preference findByPerson_Id(Long id);

}
