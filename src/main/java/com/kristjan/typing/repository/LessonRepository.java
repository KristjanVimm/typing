package com.kristjan.typing.repository;

import com.kristjan.typing.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByPerson_IdOrderByIdAsc(Long id);

    @Query("select l from Lesson l where l.person.id = ?1 and l.text <> '' order by l.id")
    List<Lesson> findByPerson_IdAndTextNotOrderByIdAsc(Long id);

}
