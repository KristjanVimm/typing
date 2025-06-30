package com.kristjan.typing.repository;

import com.kristjan.typing.entity.LessonPage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LessonPageRepository extends JpaRepository<LessonPage, Long> {

    @Query("select l from LessonPage l where l.lesson.id = ?1 order by l.id")
    List<LessonPage> findByLesson_IdOrderByIdAsc(Long id);

}
